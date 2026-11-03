import { UseCaseErrors } from '../../../../AppError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../../result';
import { UseCase } from '../../../../useCase';
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
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  deleteDiscount = async (
    discountId: string,
  ): Promise<Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.DomainValidation>> => {
    const discount = await this.discountCommandsRepo.getDiscount(discountId);
    if (!discount) {
      return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
    }

    const products = await this.productCommandsRepo.getProducts(discount.products);

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
