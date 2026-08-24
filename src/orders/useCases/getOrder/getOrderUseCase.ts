import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OrderDto } from '../../orderMapper';
import { OrderRepoI } from '../../orderRepo';
import { OrderQueriesRepoI } from '../../repo/queries';
import { GetOrderRequestDto } from './getOrderRequestDto';

type Response = Result<OrderDto, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class GetOrderUseCase implements UseCase<GetOrderRequestDto, Response> {
  constructor(private orderQueriesRepo: OrderQueriesRepoI) {}

  execute = async (request: GetOrderRequestDto): Promise<Response> => {
    const { orderNumber } = request;

    try {
      const order = await this.orderQueriesRepo.getOrderByOrderNumber(orderNumber);

      if (!order) {
        return Result.fail(new UseCaseErrors.NotFound('Order not found'));
      }

      return Result.ok(order);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
