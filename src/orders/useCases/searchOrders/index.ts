import { OrderModel } from '../../model';
import { OrderQueriesRepo } from '../../repo/queries';
import { SearchOrdersController } from './searchOrdersController';
import { SearchOrdersUseCase } from './searchOrdersUseCase';

const orderQueriesRepo = new OrderQueriesRepo(OrderModel);
const searchOrdersUseCase = new SearchOrdersUseCase(orderQueriesRepo);
export const searchOrdersController = new SearchOrdersController(searchOrdersUseCase);
