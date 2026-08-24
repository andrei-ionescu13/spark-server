import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DealDto } from '../../dealMapper';
import { DealQueriesRepoI } from '../../repo/queries';
import { GetDealRequestDto } from './getDealRequestDto';

type Response = Result<DealDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetDealUseCase implements UseCase<GetDealRequestDto, Response> {
  constructor(private dealQueriesRepo: DealQueriesRepoI) {}

  execute = async (request: GetDealRequestDto): Promise<Response> => {
    const { dealId } = request;

    try {
      const deal = await this.dealQueriesRepo.getDeal(dealId);

      if (!deal) {
        return Result.fail(new UseCaseErrors.NotFound('Deal not found'));
      }

      return Result.ok(deal);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
