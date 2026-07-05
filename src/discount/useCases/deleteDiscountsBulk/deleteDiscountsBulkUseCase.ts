import { UseCaseErrors } from '../../../AppError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { DiscountQueriesRepoI } from '../../repo/queries';
import { DeleteDiscountsBulkRequestDto } from './deleteDiscountsBulkRequestDto';

type Response = Result<
  undefined,
  UseCaseErrors.NotFound | UseCaseErrors.DomainValidation | UseCaseErrors.UnexpectedError
>;

export class DeleteDiscountsBulkUseCase
  implements UseCase<DeleteDiscountsBulkRequestDto, Response>
{
  constructor(
    private discountCommandsRepo: DiscountCommandsRepoI,
    private discountQueriesRepo: DiscountQueriesRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  deleteDiscount = async (
    discountId: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.DomainValidation>> => {
    const discount = await this.discountQueriesRepo.getDiscount(discountId);

    if (!discount) {
      return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
    }

    const productIds = discount.products.map((product) => product._id);
    const productsOrError = await this.productCommandsRepo.getProducts(productIds);
    if (productsOrError.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(productsOrError.error.message));
    }

    const products = productsOrError.value;

    for (const product of products) {
      const removeResult = product.removeDiscount();
      if (removeResult.isErr()) {
        return Result.fail(new UseCaseErrors.NotFound(removeResult.error.message));
      }
    }

    await this.discountCommandsRepo.deleteDiscount(discountId);
    await this.productCommandsRepo.saveMultiple(products);

    return Result.ok();
  };

  execute = async (request: DeleteDiscountsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const deleteResults = await Promise.all(
        ids.map((discountId) => this.deleteDiscount(discountId)),
      );
      const result = Result.combine(deleteResults);
      if (result.isErr()) {
        return Result.fail(result.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
