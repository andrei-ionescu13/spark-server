import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Deal } from './model';

export interface DealRepoI {
  createDeal: any;
  getDeal: any;
  deleteDeal: any;
  deleteMultipleDeals: any;
  listDeals: any;
  updateDeal: any;
  searchDeals: any;
  getDealsCount: any;
  duplicateDeal: any;
  removeProductFromDeals: any;
}

const buildIntervalQuery = (status) => {
  if (status === 'expired') {
    return {
      endDate: {
        $exists: true,
        $ne: null,
        $lte: Date.now(),
      },
    };
  }

  if (status === 'active') {
    return {
      startDate: {
        $lte: Date.now(),
      },
    };
  }

  if (status === 'scheduled') {
    return {
      $or: [
        {
          $and: [
            {
              endDate: {
                $gt: Date.now(),
                $exists: true,
                $ne: null,
              },
            },
            {
              startDate: {
                $gt: Date.now(),
              },
            },
          ],
        },
        {
          $and: [
            {
              endDate: null,
            },
            {
              startDate: {
                $gt: Date.now(),
              },
            },
          ],
        },
      ],
    };
  }

  return {};
};

export class DealRepo implements DealRepoI {
  constructor(private dealModel: Model<Deal>) {}

  createDeal = (props) => this.dealModel.create(props);

  getDeal = (id) =>
    this.dealModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products')
      .exec();

  deleteDeal = (id) => this.dealModel.deleteOne({ _id: id });

  deleteMultipleDeals = (ids) => this.dealModel.deleteMany({ _id: { $in: ids } });

  listDeals = (ids) => this.dealModel.find({ _id: { $in: ids } });

  updateDeal = (id, props) =>
    this.dealModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );

  searchDeals = (query) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.dealModel
      .find({
        $and: [
          {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          },
          intervalQuery,
        ],
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  };

  getDealsCount = (query) => {
    const { keyword = '', status } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.dealModel
      .find({
        $and: [
          {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          },
          intervalQuery,
        ],
      })
      .count();
  };

  duplicateDeal = async (id) => {
    const deal = await this.getDeal(id);
    //@ts-ignore
    let { _id, ...dealProps } = deal._doc;

    dealProps.status = 'draft';
    dealProps.createdAt = Date.now();

    const newDeal = await this.createDeal(dealProps);
    return newDeal;
  };

  removeProductFromDeals = (productId) =>
    this.dealModel
      .updateMany(
        { products: productId },
        {
          $pull: {
            products: productId,
          },
        },
        {
          new: true,
        },
      )
      .exec();
}
