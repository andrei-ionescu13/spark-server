import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Order } from './model';

export interface OrderRepoI {
  getOrder: any;
  getOrderByOrderNumber: any;
  createOrder: any;
  getOrderItems: any;
  updateOrder: any;
  searchOrders: any;
  getOrdersCount: any;
}

export class OrderRepo implements OrderRepoI {
  constructor(private orderModel: Model<Order>) {}

  getOrder = (id) => this.orderModel.findOne({ _id: new ObjectId(id) }).exec();

  getOrderByOrderNumber = (orderNumber) => this.orderModel.findOne({ orderNumber }).exec();

  // deleteOrder = (id) => this.orderModel.remove({ _id: id });

  // deleteMultipleOrders = (ids) => this.orderModel.deleteMany({ _id: { $in: ids } });

  createOrder = (props) => this.orderModel.create(props);

  getOrderItems = (orderNumber) =>
    this.orderModel.aggregate([
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
      // { $project: { lineItems: 1, _id: 0 } },
      // {
      //   $addFields: {
      //     "count": {
      //       $arrayElemAt: ["$count", 0]
      //     },
      //   }
      // },

      // {
      //   $match: {
      //     finalPrice: 4256.218
      //   }
      // }
    ]);

  updateOrder = (id, props) =>
    this.orderModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchOrders = (query) => {
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
    console.log(status);
    return this.orderModel
      .find({
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
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('customer')
      .exec();
  };

  getOrdersCount = (query) => {
    const { keyword = '', status, paymentStatus, fulfillmentStatus } = query;

    return this.orderModel
      .find({
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
      })
      .count();
  };
}
