import { Mongo } from '../../../../mongo';
import { OrderQueriesRepo } from '../../repo/queries';
import { ListOrderItemsController } from './listOrderItemsController';
import { ListOrderItemsUseCase } from './listOrderItemsUseCase';

const orderQueriesRepo = new OrderQueriesRepo(Mongo.getCollection('orders'));
const listOrderItemsUseCase = new ListOrderItemsUseCase(orderQueriesRepo);
export const listOrderItemsController = new ListOrderItemsController(listOrderItemsUseCase);
