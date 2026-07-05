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
import { CreateDiscountRequestDto } from '../createDiscount/createDiscountRequestDto';
import { CreateDiscountErrors } from '../createDiscount/createDiscountUseCase';
import { UpdateDiscountRequestDto } from './updateDiscountRequestDto';

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
  Discount,
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
  ) {}

  checkApplicable = async (
    products: Product[],
    props: CreateDiscountRequestDto,
  ): Promise<
    Result<
      Discount,
      | UpdateDiscountErrors.ProductHasDiscountError
      | UpdateDiscountErrors.ProductPriceError
      | UseCaseErrors.NotFound
      | UseCaseErrors.DomainValidation
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

  removeDiscountFromProducts = (products: Product[]): Result<undefined, UseCaseErrors.NotFound> => {
    for (const product of products) {
      const removeResult = product.removeDiscount();
      if (removeResult.isErr()) {
        return Result.fail(new UseCaseErrors.NotFound(removeResult.error.message));
      }
    }

    return Result.ok();
  };

  addDiscountToProducts = (products: Product[], discount: Discount) => {
    for (const product of products) {
      const result = product.addDiscount(discount._id);
      if (result.isErr()) {
        return Result.fail(result.error);
      }
    }

    return Result.ok();
  };

  getRemovedProducts = async (
    discount: Discount,
    productIds: string[],
  ): Promise<Result<Product[], UseCaseErrors.DomainValidation>> => {
    const productsOrError = await this.productCommandsRepo.getProducts(discount.products);
    if (productsOrError.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(productsOrError.error.message));
    }

    const products = productsOrError.value;
    const removedProducts = products.filter((product) => !productIds.includes(product._id));
    return Result.ok(removedProducts);
  };

  getNewProducts = async (
    discount: Discount,
    productsIds: string[],
  ): Promise<Result<Product[], UseCaseErrors.DomainValidation>> => {
    const productsOrError = await this.productCommandsRepo.getProducts(productsIds);
    if (productsOrError.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(productsOrError.error.message));
    }

    const products = productsOrError.value;
    const newProducts = products.filter((product) => !discount.products.includes(product._id));
    return Result.ok(newProducts);
  };

  execute = async (request: UpdateDiscountRequestDto): Promise<Response> => {
    const { discountId, ...props } = request;

    try {
      const discountOrError = await this.discountCommandsRepo.getDiscount(discountId);
      if (discountOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(discountOrError.error.message));
      }

      const discount = discountOrError.value;
      if (!discount) {
        return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
      }

      const productsOrError = await this.productCommandsRepo.getProducts(props.products);
      if (productsOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(productsOrError.error.message));
      }

      const removedProductsResult = await this.getRemovedProducts(discount, props.products);
      if (removedProductsResult.isErr()) {
        return Result.fail(removedProductsResult.error);
      }

      const removedProducts = removedProductsResult.value;
      const removeDiscountResult = this.removeDiscountFromProducts(removedProducts);
      if (removeDiscountResult.isErr()) {
        return Result.fail(removeDiscountResult.error);
      }

      const newProductsResult = await this.getNewProducts(discount, props.products);
      if (newProductsResult.isErr()) {
        return Result.fail(newProductsResult.error);
      }

      const newProducts = removedProductsResult.value;
      const isApplicable = await this.checkApplicable(newProducts, props);
      if (isApplicable.isErr()) {
        return Result.fail(isApplicable.error);
      }

      const addDiscountResult = this.addDiscountToProducts(newProducts, discount);
      if (addDiscountResult.isErr()) {
        return Result.fail(addDiscountResult.error);
      }

      const titleOrError = DiscountTitle.create(props.title);
      const typeOrError = DiscountType.create(props.type);
      const valueOrError = DiscountValue.create(props.value);

      const valueObjectsResult = Result.combine([titleOrError, typeOrError, valueOrError]);
      if (valueObjectsResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(valueObjectsResult.error.message));
      }

      const title = titleOrError.value;
      const type = typeOrError.value;
      const value = valueOrError.value;

      const updateResult = discount.update({
        ...props,
        title,
        type,
        value,
      });

      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      return Result.ok(discount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
