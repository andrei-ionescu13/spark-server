import Joi from 'joi';
import { orderServices } from './index';

export const orderController = {
  createOrder: async (req, res, next) => {
    const params = req.body;

    const order = await orderServices.createOrder(params);
    res.status(201).json({ order });
  },

  searchOrders: async (req, res) => {
    const { query } = req;
    ['status', 'paymentStatus', 'fulfillmentStatus'].forEach(
      (key) => (query[key] = !!query?.[key] ? query[key].split(',') : undefined),
    );

    const result = await orderServices.searchOrders(query);
    res.json(result);
  },

  getOrder: async (req, res) => {
    const { id } = req.params;
    const order = await orderServices.getOrder(id);
    res.json(order);
  },

  getOrderByOrderNumber: async (req, res) => {
    const { orderNumber } = req.params;
    const order = await orderServices.getOrderByOrderNumber(orderNumber);
    res.json(order);
  },

  getOrderItems: async (req, res) => {
    const { orderNumber } = req.params;
    const items = await orderServices.getOrderItems(orderNumber);
    res.json(items);
  },
  // listPublishers: async (_, res) => {
  //   const publishers = await publisherServices.listPublishers()
  //   res.json(publishers)
  // },

  // deletePublisher: async (req, res) => {
  //   const { id } = req.params;
  //   await publisherServices.deletePublisher(id);

  //   res.status(200).json({ ok: 'ok' })
  // },

  // deleteMultiplePublishers: async (req, res) => {
  //   const { ids } = req.body;
  //   await Promise.all(ids.map((id) => publisherServices.deletePublisher(id)))

  //   res.status(200).json({ ok: 'ok' })
  // },

  // updatePublisher: async (req, res, next) => {
  //   const { id } = req.params;
  //   const props = req.body;

  //   const { error } = schema.validate({
  //     ...props,
  //     logo: props.logo || req.file
  //   });

  //   if (error) {
  //     next(new ValidationError(error.message))
  //     return;
  //   }

  //   try {
  //     const updatedPublisher = await publisherServices.updatePublisher(id, props, req.file)
  //     res.json({ publisher: updatedPublisher })
  //   } catch (error) {
  //     next(error)
  //   }
  // }
};
