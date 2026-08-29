import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { LineItemDto } from '../../lineItemMapper';
import { OrderRepoI } from '../../orderRepo';
import { OrderQueriesRepoI } from '../../repo/queries';
import { ListOrderItemsRequestDto } from './listOrderItemsRequestDto';

type Response = Result<LineItemDto[], UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class ListOrderItemsUseCase implements UseCase<ListOrderItemsRequestDto, Response> {
  constructor(private orderQueriesRepo: OrderQueriesRepoI) {}

  execute = async (request: ListOrderItemsRequestDto): Promise<Response> => {
    const { orderNumber } = request;

    try {
      const order = await this.orderQueriesRepo.getOrderByOrderNumber(orderNumber);

      if (!order) {
        return Result.fail(new UseCaseErrors.NotFound('Order not found'));
      }

      const lineItems = await this.orderQueriesRepo.getOrderItems(orderNumber);
      return Result.ok(lineItems);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
