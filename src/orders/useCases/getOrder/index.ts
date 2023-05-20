import { OrderModel } from '../../model';
import { OrderRepo } from '../../orderRepo';
import { GetOrderController } from './getOrderController';
import { GetOrderUseCase } from './getOrderUseCase';

const orderRepo = new OrderRepo(OrderModel);
const getOrderUseCase = new GetOrderUseCase(orderRepo);
export const getOrderController = new GetOrderController(getOrderUseCase);
