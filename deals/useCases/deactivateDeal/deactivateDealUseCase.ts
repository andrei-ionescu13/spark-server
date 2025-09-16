import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { DealRepoI } from '../../dealRepo';
import { DeactivateDealRequestDto } from './deactivateRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class DeactivateDealUseCase implements UseCase<DeactivateDealRequestDto, Response> {
  constructor(private dealRepo: DealRepoI) {}

  execute = async (request: DeactivateDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealRepo.getDeal(dealId);
      const found = !!deal;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Deal not found'));
      }

      await this.dealRepo.updateDeal(dealId, { endDate: Date.now() });

      return right(Result.ok(deal));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
