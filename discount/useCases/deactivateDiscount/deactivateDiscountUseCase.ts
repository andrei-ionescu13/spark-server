import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { DiscountRepoI } from '../../discountRepo';
import { DeactivateDiscountRequestDto } from './deactivateDiscountRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class DeactivateDiscountUseCase implements UseCase<DeactivateDiscountRequestDto, Response> {
  constructor(private discountRepo: DiscountRepoI) {}

  execute = async (request: DeactivateDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
      const discount = await this.discountRepo.getDiscount(discountId);
      const found = !!discount;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Discount not found'));
      }

      await this.discountRepo.updateDiscount(discountId, { endDate: Date.now() });

      return right(Result.ok<any>(discount));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
