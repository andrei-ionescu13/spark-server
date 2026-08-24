import { OrderModel } from '../../model';
import { OrderQueriesRepo } from '../../repo/queries';
import { ListOrderItemsController } from './listOrderItemsController';
import { ListOrderItemsUseCase } from './listOrderItemsUseCase';

const orderQueriesRepo = new OrderQueriesRepo(OrderModel);
const listOrderItemsUseCase = new ListOrderItemsUseCase(orderQueriesRepo);
export const listOrderItemsController = new ListOrderItemsController(listOrderItemsUseCase);
