import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { OrderDto, OrderMapper } from '../orderMapper';
import { LineItemDto, LineItemMapper } from '../lineItemMapper';
import { OrderDoc } from '../model';

type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

interface SearchOrdersQuery {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status?: Status[];
  paymentStatus?: PaymentStatus[];
  fulfillmentStatus?: FulfillmentStatus[];
}

export interface OrderQueriesRepoI {
  getOrder: (id: string) => Promise<OrderDto | null>;
  getOrderByOrderNumber: (orderNumber: string) => Promise<OrderDto | null>;
  getOrderItems: (orderNumber: string) => Promise<LineItemDto[]>;
  searchOrders: (query: SearchOrdersQuery) => Promise<{ orders: OrderDto[]; count: number }>;
}

export class OrderQueriesRepo implements OrderQueriesRepoI {
  constructor(private orderModel: Model<OrderDoc>) {}

  getOrder = async (id: string): Promise<OrderDto | null> => {
    const doc = await this.orderModel.findOne({ _id: id }).lean();
    if (!doc) return null;

    const order = OrderMapper.toDto(doc);
    return order;
  };

  getOrderByOrderNumber = async (orderNumber: string): Promise<OrderDto | null> => {
    const doc = await this.orderModel.findOne({ orderNumber }).lean();
    if (!doc) return null;

    const order = OrderMapper.toDto(doc);
    return order;
  };

  getOrderItems = async (orderNumber: string): Promise<LineItemDto[]> => {
    const docs = await this.orderModel.aggregate([
      {
        $match: {
          orderNumber,
        },
      },
      { $unwind: '$lineItems' },
      { $replaceRoot: { newRoot: '$lineItems' } },
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $set: {
          product: { $arrayElemAt: ['$product', 0] },
        },
      },
    ]);

    return LineItemMapper.toDtoList(docs);
  };

  searchOrders = async (
    query: SearchOrdersQuery,
  ): Promise<{ orders: OrderDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
      paymentStatus,
      fulfillmentStatus,
    } = query;

    const [result] = await this.orderModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                {
                  orderNumber: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
                {
                  email: {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
              ],
            },
            ...(status || paymentStatus || fulfillmentStatus
              ? [
                  {
                    $or: [
                      {
                        status: {
                          $in: status,
                        },
                      },
                      {
                        paymentStatus: {
                          $in: paymentStatus,
                        },
                      },
                      {
                        fulfillmentStatus: {
                          $in: fulfillmentStatus,
                        },
                      },
                    ],
                  },
                ]
              : [{}]),
          ],
        },
      },
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      {
        $facet: {
          orders: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $addFields: {
          count: { $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0] },
        },
      },
    ]);

    return {
      orders: OrderMapper.toDtoList(result.reviews),
      count: result.count,
    };
  };
}
