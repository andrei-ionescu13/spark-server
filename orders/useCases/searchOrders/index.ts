import { OrderModel } from '../../model';
import { OrderRepo } from '../../orderRepo';
import { SearchOrdersController } from './searchOrdersController';
import { SearchOrdersUseCase } from './searchOrdersUseCase';

const orderRepo = new OrderRepo(OrderModel);
const searchOrdersUseCase = new SearchOrdersUseCase(orderRepo);
export const searchOrdersController = new SearchOrdersController(searchOrdersUseCase);
