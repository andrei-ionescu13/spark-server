import { Mongo } from '../../../../mongo';
import { OrderQueriesRepo } from '../../repo/queries';
import { GetOrderController } from './getOrderController';
import { GetOrderUseCase } from './getOrderUseCase';

const orderQueriesRepo = new OrderQueriesRepo(Mongo.getCollection('orders'));
const getOrderUseCase = new GetOrderUseCase(orderQueriesRepo);
export const getOrderController = new GetOrderController(getOrderUseCase);
