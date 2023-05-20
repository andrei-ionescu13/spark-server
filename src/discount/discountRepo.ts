import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Discount } from './model';

export interface DiscountRepoI {
  createDiscount: any;
  getDiscount: any;
  deleteDiscount: any;
  deleteMultipleDiscounts: any;
  listDiscounts: any;
  updateDiscount: any;
  searchDiscounts: any;
  getDiscountsCount: any;
  removeProductFromDiscounts: any;
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

export class DiscountRepo implements DiscountRepoI {
  constructor(private discountModel: Model<Discount>) {}

  createDiscount = (props) => this.discountModel.create(props);

  getDiscount = (id) =>
    this.discountModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products')
      .exec();

  deleteDiscount = (id) => this.discountModel.deleteOne({ _id: id });

  deleteMultipleDiscounts = (ids) => this.discountModel.deleteMany({ _id: { $in: ids } });

  listDiscounts = () => this.discountModel.find({});

  updateDiscount = (id, props) =>
    this.discountModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchDiscounts = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'asc', page, limit, status } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.discountModel
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
      .skip(page * limit)
      .limit(limit)
      .populate('products')
      .exec();
  };

  getDiscountsCount = (query) => {
    const { keyword = '', status } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.discountModel
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

  // duplicateDiscount = async (id) => {
  //   const article = await this.getDiscount(id);
  //   let { _id, ...articleProps } = article._doc;
  //   articleProps.status = 'draft';
  //   const newDiscount = await this.createDiscount(articleProps)
  //   return newDiscount
  // }

  removeProductFromDiscounts = (productId) =>
    this.discountModel
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
