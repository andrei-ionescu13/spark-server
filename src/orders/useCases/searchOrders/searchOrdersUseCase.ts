import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OrderDto } from '../../orderMapper';
import { OrderQueriesRepoI } from '../../repo/queries';
import { SearchOrdersRequestDto } from './searchOrdersRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ orders: OrderDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchOrdersUseCase implements UseCase<SearchOrdersRequestDto, Response> {
  constructor(private urderQueriesRepo: OrderQueriesRepoI) {}

  execute = async (request: SearchOrdersRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const result = await this.urderQueriesRepo.searchOrders(query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
