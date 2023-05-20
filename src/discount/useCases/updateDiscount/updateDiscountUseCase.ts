import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { DiscountRepoI } from '../../discountRepo';
import { UpdateDiscountRequestDto } from './updateDiscountRequestDto';

export namespace UpdateDiscountErrors {
  export class ProductHasDiscountError extends Result<UseCaseError> {
    constructor(productTitle: string) {
      super(false, { message: `${productTitle} has a discount already` });
    }
  }
}

type Response = Either<
  AppError.UnexpectedError | AppError.NotFound | UpdateDiscountErrors.ProductHasDiscountError,
  Result<any>
>;

export class UpdateDiscountUseCase implements UseCase<UpdateDiscountRequestDto, Response> {
  constructor(private discountRepo: DiscountRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: UpdateDiscountRequestDto): Promise<Response> => {
    const { discountId, ...rest } = request;
    const props = rest;

    try {
      const discount = await this.discountRepo.getDiscount(discountId);
      const found = !!discount;

      if (!found) {
        return left(new AppError.NotFound('Discount not found'));
      }

      const products = await this.productRepo.getProducts(props.products);
      products.forEach((product) => {
        if (!product.discount || product.discount?._id.toString() === discountId) return;

        const now = Date.now();
        let { endDate } = product.discount;
        endDate = endDate && new Date(endDate);

        if (!endDate || (endDate && endDate.getTime() > now)) {
          return left(new UpdateDiscountErrors.ProductHasDiscountError(product.title));
        }
      });

      const prevProducts = discount.products.map((x) => x._id.toString());
      const removedProducts = prevProducts.filter((product) => !props.products.includes(product));
      await removedProducts.map((product) =>
        this.productRepo.updateProduct(product, { discount: null }),
      );
      const updatedDiscount = await this.discountRepo.updateDiscount(discountId, props);
      await updatedDiscount.products.map((product) =>
        this.productRepo.updateProduct(product, { discount }),
      );

      return right(Result.ok<any>(updatedDiscount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
