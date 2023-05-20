import { OrderRepo } from './orderRepo';
import { OrderModel } from './model';
export { default as orderRoutes } from './routes';

export const orderDb = new OrderRepo(OrderModel);
