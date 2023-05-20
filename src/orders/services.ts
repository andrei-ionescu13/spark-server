import { orderDb } from './index';

const getOrder = (id) => orderDb.getOrder(id);

const getOrderByOrderNumber = (orderNumber) => orderDb.getOrderByOrderNumber(orderNumber);

const searchOrders = async (query) => {
  const orders = await orderDb.searchOrders(query);
  const count = await orderDb.getOrdersCount(query);

  return { orders, count };
};

const updateOrder = async () => {};

const createOrder = (props) => orderDb.createOrder(props);

const getOrderItems = (orderNumber) => orderDb.getOrderItems(orderNumber);

export const orderServices = {
  searchOrders,
  updateOrder,
  getOrder,
  createOrder,
  getOrderByOrderNumber,
  getOrderItems,
};
