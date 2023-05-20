import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OrderRepoI } from '../../orderRepo';
import { SearchOrdersRequestDto } from './searchOrdersRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchOrdersUseCase implements UseCase<SearchOrdersRequestDto, Response> {
  constructor(private orderRepo: OrderRepoI) {}

  execute = async (request: SearchOrdersRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const orders = await this.orderRepo.searchOrders(query);
      const count = await this.orderRepo.getOrdersCount(query);

      return right(Result.ok<any>({ orders, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
