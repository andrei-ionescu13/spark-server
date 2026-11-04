import { UseCaseErrors } from '../../../../appErrors';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { DiscountDto } from '../../discountMapper';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { DiscountQueriesRepoI } from '../../repo/queries';
import { DeleteDiscountRequestDto } from './deleteDiscountRequestDto';

type Response = Result<
  string,
  UseCaseErrors.NotFound | UseCaseErrors.DomainValidation | UseCaseErrors.UnexpectedError
>;

export class DeleteDiscountUseCase implements UseCase<DeleteDiscountRequestDto, Response> {
  constructor(
    private discountCommandsRepo: DiscountCommandsRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  execute = async (request: DeleteDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
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

      return Result.ok(discount._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
