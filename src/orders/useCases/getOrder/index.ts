import { OrderModel } from '../../model';
import { OrderQueriesRepo } from '../../repo/queries';
import { GetOrderController } from './getOrderController';
import { GetOrderUseCase } from './getOrderUseCase';

const orderQueriesRepo = new OrderQueriesRepo(OrderModel);
const getOrderUseCase = new GetOrderUseCase(orderQueriesRepo);
export const getOrderController = new GetOrderController(getOrderUseCase);
