import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { OrderRepoI } from '../../orderRepo';
import { GetOrderRequestDto } from './getOrderRequestDto';

type Response = Either<UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound, Result<any>>;

export class GetOrderUseCase implements UseCase<GetOrderRequestDto, Response> {
  constructor(private orderRepo: OrderRepoI) {}

  execute = async (request: GetOrderRequestDto): Promise<Response> => {
    const { orderNumber } = request;

    try {
      const order = await this.orderRepo.getOrderByOrderNumber(orderNumber);
      const found = !!order;

      if (!found) {
        return left(new UseCaseErrors.NotFound('Order not found'));
      }

      return right(Result.ok<any>(order));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
