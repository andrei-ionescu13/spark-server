import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../appErrors';
import { Product } from '../../../product/domain/product';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../useCaseErrors';
import { Discount, DiscountCreateProps } from '../../domain/discount';
import { DiscountTitle } from '../../domain/discountTitle';
import { DiscountType } from '../../domain/discountType';
import { DiscountValue } from '../../domain/discountValue';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { CreateDiscountRequestDto } from './createDiscountRequestDto';
import { DiscountApplicableChecker } from '../../discountApplicableChecker';

export namespace CreateDiscountErrors {
  export class ProductHasDiscountError extends UseCaseError {
    constructor(message: string) {
      super(message);
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
  CreateDiscountErrors.ProductHasDiscountError | UseCaseErrors.UnexpectedError
>;

export class CreateDiscountUseCase implements UseCase<CreateDiscountRequestDto, Response> {
  constructor(
    private discountCommandsRepo: DiscountCommandsRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
    private discountApplicableChecker: DiscountApplicableChecker,
  ) {}

  execute = async (request: CreateDiscountRequestDto): Promise<Response> => {
    try {
      const product = await this.productCommandsRepo.getProduct(request.product);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      if (product.discount) {
        const existingDiscount = await this.discountCommandsRepo.getDiscount(product.discount);
        if (!existingDiscount) {
          return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
        }

        const isApplicable = await this.discountApplicableChecker.check(product, existingDiscount, {
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

      const props: DiscountCreateProps = {
        endDate: request.endDate,
        product: request.product,
        startDate: request.startDate,
        title,
        type,
        value,
      };

      const discountOrError = Discount.create(props);
      if (discountOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(discountOrError.error.message));
      }

      const discount = discountOrError.value;
      const addDiscountResult = product.addDiscount(discount._id);
      if (addDiscountResult.isErr()) {
        return Result.fail(addDiscountResult.error);
      }

      await this.discountCommandsRepo.save(discount);
      await this.productCommandsRepo.save(product);

      return Result.ok(discount._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
