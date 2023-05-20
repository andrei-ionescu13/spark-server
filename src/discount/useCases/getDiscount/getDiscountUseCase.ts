import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DiscountRepoI } from '../../discountRepo';
import { GetDiscountRequestDto } from './getDiscountRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetDiscountUseCase implements UseCase<GetDiscountRequestDto, Response> {
  constructor(private discountRepo: DiscountRepoI) {}

  execute = async (request: GetDiscountRequestDto): Promise<Response> => {
    const { discountId } = request;

    try {
      const discount = await this.discountRepo.getDiscount(discountId);
      const found = !!discount;

      if (!found) {
        return left(new AppError.NotFound('Discount not found'));
      }

      return right(Result.ok<any>(discount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
