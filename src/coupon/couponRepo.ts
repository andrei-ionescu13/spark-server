import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Coupon } from './model';

export interface CouponRepoI {
  createCoupon: any;
  getCoupon: any;
  deleteCoupon: any;
  deleteMultipleCoupons: any;
  listCoupons: any;
  updateCoupon: any;
  searchCoupons: any;
  getCouponsCount: any;
  removeProductFromCoupons: any;
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
      $and: [
        {
          startDate: {
            $lte: Date.now(),
          },
        },
        {
          $or: [
            {
              endDate: {
                $gt: Date.now(),
              },
            },
            {
              endDate: null,
            },
          ],
        },
      ],
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

export class CouponRepo implements CouponRepoI {
  constructor(private promoCodeModel: Model<Coupon>) {}

  createCoupon = (props) => this.promoCodeModel.create(props);

  getCoupon = (id) =>
    this.promoCodeModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products users')
      .exec();

  deleteCoupon = (id) => this.promoCodeModel.deleteOne({ _id: id });

  deleteMultipleCoupons = (ids) => this.promoCodeModel.deleteMany({ _id: { $in: ids } });

  listCoupons = () => this.promoCodeModel.find({});

  updateCoupon = (id, props) =>
    this.promoCodeModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchCoupons = (query) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.promoCodeModel
      .find({
        $and: [
          {
            code: {
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
      .populate('products users')
      .exec();
  };

  getCouponsCount = (query) => {
    const { keyword = '', status } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.promoCodeModel
      .find({
        $and: [
          {
            code: {
              $regex: keyword,
              $options: 'i',
            },
          },
          intervalQuery,
        ],
      })
      .count();
  };

  // duplicateCoupon = async (id) => {
  //   const article = await this.getCoupon(id);
  //   let { _id, ...articleProps } = article._doc;
  //   articleProps.status = 'draft';
  //   const newCoupon = await this.createCoupon(articleProps)
  //   return newCoupon
  // }

  removeProductFromCoupons = (productId) =>
    this.promoCodeModel
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
