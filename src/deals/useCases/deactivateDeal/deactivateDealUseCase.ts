import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DealRepoI } from '../../dealRepo';
import { DeactivateDealRequestDto } from './deactivateRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeactivateDealUseCase implements UseCase<DeactivateDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI) {}

  execute = async (request: DeactivateDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new AppError.NotFound('Deal not found'));
      }

      await this.dealRepo.updateDeal(dealId, { endDate: Date.now() });

      return right(Result.ok(deal));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
