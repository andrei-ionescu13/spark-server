import { OrderModel } from '../../model';
import { OrderRepo } from '../../orderRepo';
import { ListOrderItemsController } from './listOrderItemsController';
import { ListOrderItemsUseCase } from './listOrderItemsUseCase';

const orderRepo = new OrderRepo(OrderModel);
const listOrderItemsUseCase = new ListOrderItemsUseCase(orderRepo);
export const listOrderItemsController = new ListOrderItemsController(listOrderItemsUseCase);
