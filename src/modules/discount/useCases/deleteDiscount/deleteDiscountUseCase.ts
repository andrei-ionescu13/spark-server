import { UseCaseErrors } from '../../../../AppError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { DiscountDto } from '../../discountMapper';
import { DiscountCommandsRepoI } from '../../repo/commands';
import { DiscountQueriesRepoI } from '../../repo/queries';
import { DeleteDiscountRequestDto } from './deleteDiscountRequestDto';

type Response = Result<
  DiscountDto,
  UseCaseErrors.NotFound | UseCaseErrors.DomainValidation | UseCaseErrors.UnexpectedError
>;

export class DeleteDiscountUseCase implements UseCase<DeleteDiscountRequestDto, Response> {
  constructor(
    private discountCommandsRepo: DiscountCommandsRepoI,
    private discountQueriesRepo: DiscountQueriesRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
  ) {}

  execute = async (request: DeleteDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
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

      return Result.ok(discount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
