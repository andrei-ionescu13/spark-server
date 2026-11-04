import { UseCaseErrors } from '../../../../appError';
import { Product } from '../../../product/domain/product';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../useCaseError';
import { Discount, DiscountCreateProps, DiscountUpdateProps } from '../../domain/discount';
import { DiscountTitle } from '../../domain/discountTitle';
import { DiscountType } from '../../domain/discountType';
import { DiscountValue } from '../../domain/discountValue';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { CreateDiscountRequestDto } from '../createDiscount/createDiscountRequestDto';
import { CreateDiscountErrors } from '../createDiscount/createDiscountUseCase';
import { UpdateDiscountRequestDto } from './updateDiscountRequestDto';
import { DiscountApplicableChecker } from '../../discountApplicableChecker';

export namespace UpdateDiscountErrors {
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
  string,
  | UpdateDiscountErrors.ProductHasDiscountError
  | UpdateDiscountErrors.ProductPriceError
  | UseCaseErrors.NotFound
  | UseCaseErrors.DomainValidation
  | UseCaseErrors.UnexpectedError
>;

export class UpdateDiscountUseCase implements UseCase<UpdateDiscountRequestDto, Response> {
  constructor(
    private discountCommandsRepo: DiscountCommandsRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
    private discountApplicableChecker: DiscountApplicableChecker,
  ) {}

  execute = async (request: UpdateDiscountRequestDto): Promise<Response> => {
    console.log(request);
    try {
      const discount = await this.discountCommandsRepo.getDiscount(request.discountId);
      if (!discount) {
        return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
      }

      const product = await this.productCommandsRepo.getProduct(request.product);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('product not found'));
      }

      const discountPreviousProductId = discount.product;

      if (product.discount) {
        const isApplicable = await this.discountApplicableChecker.check(product, discount, {
          type: request.type,
          value: request.value,
        });
        if (isApplicable.isErr()) {
          return Result.fail(isApplicable.error);
        }
      }

      const titleOrError = DiscountTitle.create(request.title);
      const typeOrError = DiscountType.create(request.type);
      const valueOrError = DiscountValue.create(request.value);

      const result = Result.combine([titleOrError, typeOrError, valueOrError]);
      if (result.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(result.error.message));
      }

      const title = titleOrError.value;
      const type = typeOrError.value;
      const value = valueOrError.value;

      const props: DiscountUpdateProps = {
        endDate: request.endDate,
        product: request.product,
        startDate: request.startDate,
        title,
        type,
        value,
      };

      const updateResult = discount.update(props);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      if (discount.product !== discountPreviousProductId) {
        const discountPreviousProduct = await this.productCommandsRepo.getProduct(
          discountPreviousProductId,
        );

        if (!discountPreviousProduct) {
          return Result.fail(new UseCaseErrors.NotFound('Previous product not found'));
        }

        discountPreviousProduct.removeDiscount();

        const addDiscountResult = product.addDiscount(discount._id);
        if (addDiscountResult.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(addDiscountResult.error.message));
        }

        await Promise.all([
          this.productCommandsRepo.save(discountPreviousProduct),
          this.productCommandsRepo.save(product),
        ]);
      }

      await this.discountCommandsRepo.save(discount);
      return Result.ok(discount._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
