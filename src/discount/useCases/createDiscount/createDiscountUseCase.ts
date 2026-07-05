import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../AppError';
import { Product } from '../../../product/product';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { Discount } from '../../discount';
import { DiscountTitle } from '../../discountTitle';
import { DiscountType } from '../../discountType';
import { DiscountValue } from '../../discountValue';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { CreateDiscountRequestDto } from './createDiscountRequestDto';

export namespace CreateDiscountErrors {
  export class ProductHasDiscountError extends UseCaseError {
    constructor(productTitle: string) {
      super(`${productTitle} has a discount already`);
    }
  }

  export class ProductPriceError extends UseCaseError {
    constructor(productTitle: string) {
      super(`Discount can't be bigger thant ${productTitle} price`);
    }
  }
}

type Response = Result<
  Discount,
  CreateDiscountErrors.ProductHasDiscountError | UseCaseErrors.UnexpectedError
>;

export class CreateDiscountUseCase implements UseCase<CreateDiscountRequestDto, Response> {
  constructor(
    private discountCommandsRepo: DiscountCommandsRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  checkApplicable = async (
    products: Product[],
    props: CreateDiscountRequestDto,
  ): Promise<
    Result<
      Discount,
      | CreateDiscountErrors.ProductHasDiscountError
      | CreateDiscountErrors.ProductPriceError
      | UseCaseErrors.DomainValidation
      | UseCaseErrors.NotFound
    >
  > => {
    for (const product of products) {
      if (!product.discount) continue;

      const discountOrError = await this.discountCommandsRepo.getDiscount(product.discount);
      if (discountOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(discountOrError.error.message));
      }

      const discount = discountOrError.value;
      if (!discount) {
        return Result.fail(new UseCaseErrors.NotFound('Product discount not found'));
      }

      const now = Date.now();
      let endDate = discount.endDate;
      endDate = endDate && new Date(endDate);

      if (!endDate || (endDate && endDate.getTime() > now)) {
        return Result.fail(new CreateDiscountErrors.ProductHasDiscountError(product.title.value));
      }

      if (props.type === 'amount' && product.price.value - props.value <= 0) {
        return Result.fail(new CreateDiscountErrors.ProductPriceError(product.title.value));
      }
    }

    return Result.ok();
  };

  execute = async (request: CreateDiscountRequestDto): Promise<Response> => {
    const props = request;

    try {
      const productsOrError = await this.productCommandsRepo.getProducts(props.products);
      if (productsOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productsOrError.error.message));
      }

      const products = productsOrError.value;
      const isApplicable = await this.checkApplicable(products, props);
      if (isApplicable.isErr()) {
        return Result.fail(isApplicable.error);
      }

      const titleOrError = DiscountTitle.create(props.title);
      const typeOrError = DiscountType.create(props.type);
      const valueOrError = DiscountValue.create(props.value);

      const result = Result.combine([titleOrError, typeOrError, valueOrError]);
      if (result.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(result.error.message));
      }

      const title = titleOrError.value;
      const type = typeOrError.value;
      const value = valueOrError.value;

      const discountOrError = Discount.create({ ...props, title, type, value, _id: uuidv7() });
      if (discountOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(discountOrError.error.message));
      }

      const discount = discountOrError.value;
      for (const product of products) {
        const result = product.addDiscount(discount._id);
        if (result.isErr()) {
          return Result.fail(result.error);
        }
      }

      await this.discountCommandsRepo.save(discount);
      await this.productCommandsRepo.saveMultiple(products);

      return Result.ok(discount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
