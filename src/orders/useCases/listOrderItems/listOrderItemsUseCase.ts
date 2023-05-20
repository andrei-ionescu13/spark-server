import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OrderRepoI } from '../../orderRepo';
import { ListOrderItemsRequestDto } from './listOrderItemsRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class ListOrderItemsUseCase implements UseCase<ListOrderItemsRequestDto, Response> {
  constructor(private orderRepo: OrderRepoI) {}

  execute = async (request: ListOrderItemsRequestDto): Promise<Response> => {
    const { orderNumber } = request;

    try {
      const order = await this.orderRepo.getOrderByOrderNumber(orderNumber);
      const found = !!order;

      if (!found) {
        return left(new AppError.NotFound('Order not found'));
      }

      const items = await this.orderRepo.getOrderItems(orderNumber);

      return right(Result.ok<any>(items));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
