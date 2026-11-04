import { OrderDto, OrderMapper } from '../orderMapper';
import { OrderDoc, OrderLineItemDoc, OrderLineItemPopulateDoc } from '../model';
import { Collection } from 'mongodb';
import { OrderLineItemDto, OrderLineItemMapper } from '../orderLineItemMapper';

type Status = 'open' | 'archived' | 'canceled';
type PaymentStatus = 'authorized' | 'paid' | 'pending' | 'refunded' | 'expired';
type FulfillmentStatus = 'fulfilled' | 'unfulfilled' | 'partially fulfilled';

interface SearchOrdersQueries {
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
  getOrderItems: (orderNumber: string) => Promise<OrderLineItemDto[]>;
  searchOrders: (query: SearchOrdersQueries) => Promise<{ orders: OrderDto[]; count: number }>;
}

export class OrderQueriesRepo implements OrderQueriesRepoI {
  constructor(private collection: Collection<OrderDoc>) {}

  getOrder = async (id: string): Promise<OrderDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const order = OrderMapper.toDto(doc);
    return order;
  };

  getOrderByOrderNumber = async (orderNumber: string): Promise<OrderDto | null> => {
    const doc = await this.collection.findOne({ orderNumber });
    if (!doc) return null;

    const order = OrderMapper.toDto(doc);
    return order;
  };

  getOrderItems = async (orderNumber: string): Promise<OrderLineItemDto[]> => {
    const pipeline = [
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
      {
        $lookup: {
          from: 'discounts',
          localField: 'discount',
          foreignField: '_id',
          as: 'discount',
        },
      },
      {
        $unwind: {
          path: '$discount',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'coupons',
          localField: 'coupon',
          foreignField: '_id',
          as: 'coupon',
        },
      },
      {
        $unwind: {
          path: '$coupon',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'keys',
          localField: 'keys',
          foreignField: '_id',
          as: 'keys',
        },
      },
    ];
    const docs = await this.collection.aggregate<OrderLineItemPopulateDoc>(pipeline).toArray();
    return OrderLineItemMapper.toDtoList(docs);
  };

  searchOrders = async (
    query: SearchOrdersQueries,
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

    const pipeline = [
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      orders: OrderMapper.toDtoList(result.orders),
      count: result.count,
    };
  };
}
