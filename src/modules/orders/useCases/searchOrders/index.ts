import { Mongo } from '../../../../mongo';
import { OrderQueriesRepo } from '../../repo/queries';
import { SearchOrdersController } from './searchOrdersController';
import { SearchOrdersUseCase } from './searchOrdersUseCase';

const orderQueriesRepo = new OrderQueriesRepo(Mongo.getCollection('orders'));
const searchOrdersUseCase = new SearchOrdersUseCase(orderQueriesRepo);
export const searchOrdersController = new SearchOrdersController(searchOrdersUseCase);
