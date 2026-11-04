import { UseCaseErrors } from '../../appErrors';
import { Result } from '../../results';
import { Product } from '../product/domain/product';
import { Discount } from './domain/discount';
import { CreateDiscountRequestDto } from './useCases/createDiscount/createDiscountRequestDto';

export namespace CreateDiscountErrors {
  export class ProductHasDiscountError extends Error {
    constructor(message: string) {
      super(message);
    }
  }

  export class ProductPriceError extends Error {
    constructor() {
      super(`Discount value not allowed`);
    }
  }
}

export class DiscountApplicableChecker {
  public async check(
    product: Product,
    discount: Discount,
    props: {
      type: 'amount' | 'percentage';
      value: number;
    },
  ): Promise<
    Result<
      Discount,
      | CreateDiscountErrors.ProductHasDiscountError
      | CreateDiscountErrors.ProductPriceError
      | UseCaseErrors.DomainValidation
      | UseCaseErrors.NotFound
    >
  > {
    if (discount.isActive) {
      return Result.fail(
        new CreateDiscountErrors.ProductHasDiscountError(
          `${product.title.value} has an active discount`,
        ),
      );
    }

    if (discount.isScheduled) {
      return Result.fail(
        new CreateDiscountErrors.ProductHasDiscountError(
          `${product.title.value} has a scheduled discount`,
        ),
      );
    }

    if (props.type === 'amount' && product.price.value - props.value <= 0) {
      return Result.fail(new CreateDiscountErrors.ProductPriceError());
    }

    if (props.type === 'percentage' && (props.value <= 0 || props.value >= 100)) {
      return Result.fail(new CreateDiscountErrors.ProductPriceError());
    }

    return Result.ok();
  }
}
