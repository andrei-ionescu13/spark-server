import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { DiscountRepoI } from '../../discountRepo';
import { CreateDiscountRequestDto } from './createDiscountRequestDto';

export namespace CreateDiscountErrors {
  export class ProductHasDiscountError extends Result<UseCaseError> {
    constructor(productTitle: string) {
      super(false, { message: `${productTitle} has a discount already` });
    }
  }

  export class ProductPriceError extends Result<UseCaseError> {
    constructor(productTitle: string) {
      super(false, { message: `Discount can't be bigger thant ${productTitle} price` });
    }
  }
}

type Response = Either<
  AppError.UnexpectedError | CreateDiscountErrors.ProductHasDiscountError,
  Result<any>
>;

export class CreateDiscountUseCase implements UseCase<CreateDiscountRequestDto, Response> {
  constructor(private discountRepo: DiscountRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: CreateDiscountRequestDto): Promise<Response> => {
    const props = request;

    try {
      const products = await this.productRepo.getProducts(props.products);

      products.forEach((product) => {
        if (!product.discount) return;

        const now = Date.now();
        let { endDate } = product.discount;
        endDate = endDate && new Date(endDate);

        if (!endDate || (endDate && endDate.getTime() > now)) {
          return left(new CreateDiscountErrors.ProductHasDiscountError(product.title));
        }

        if (props.type === 'amount' || product.price - props.value <= 0) {
          return left(new CreateDiscountErrors.ProductPriceError(product.title));
        }
      });

      const discount = await this.discountRepo.createDiscount(props);
      await discount.products.map((product) =>
        this.productRepo.updateProduct(product, { discount }),
      );

      return right(Result.ok<any>(discount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
