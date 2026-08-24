import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DealDto } from '../../dealMapper';
import { DealQueriesRepoI } from '../../repo/queries';
import { SearchDealsRequestDto } from './searchDealsRequestDto';

type Response = Result<{ deals: DealDto[]; count: number }, UseCaseErrors.UnexpectedError>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchDealsUseCase implements UseCase<SearchDealsRequestDto, Response> {
  constructor(private dealQueriesRepo: DealQueriesRepoI) {}

  execute = async (request: SearchDealsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const result = await this.dealQueriesRepo.searchDeals(query);

      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
