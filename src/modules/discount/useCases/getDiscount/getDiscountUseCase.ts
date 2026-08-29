import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { DiscountDto } from '../../discountMapper';
import { DiscountQueriesRepoI } from '../../repo/queries';
import { GetDiscountRequestDto } from './getDiscountRequestDto';

type Response = Result<DiscountDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetDiscountUseCase implements UseCase<GetDiscountRequestDto, Response> {
  constructor(private discountQueriesRepo: DiscountQueriesRepoI) {}

  execute = async (request: GetDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
      const discount = await this.discountQueriesRepo.getDiscount(discountId);
      if (!discount) {
        return Result.fail(new UseCaseErrors.NotFound('Discount not found'));
      }

      return Result.ok(discount);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
