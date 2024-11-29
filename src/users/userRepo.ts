import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { User } from './model';

export interface UserRepoI {
  getUser: any;
  deleteReview: any;
  createUser: any;
  updateUser: any;
  searchUsers: any;
  getUsersCount: any;
  searchUserReviews: any;
  getUserReviewsCount: any;
  addCoupon: any;
  deleteCoupon: any;
}

export class UserRepo implements UserRepoI {
  constructor(private userModel: Model<User>) {}

  getUser = (id) => this.userModel.findOne({ _id: new ObjectId(id) }).exec();

  // deleteUser = (id) => this.userModel.remove({ _id: id });

  // deleteMultipleUsers = (ids) => this.userModel.deleteMany({ _id: { $in: ids } });

  deleteReview = (id, reviewId) =>
    this.userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            reviews: reviewId,
          },
        },
        {
          new: true,
        },
      )
      .exec();

  createUser = (props) => this.userModel.create(props);

  updateUser = (id, props) =>
    this.userModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchUsers = (query) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      page = 1,
      limit = 10,
    } = query;

    return this.userModel
      .find({
        email: {
          $regex: keyword,
          $options: 'i',
        },
        ...(status && {
          status,
        }),
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  };

  getUsersCount = (query) => {
    const { keyword = '', status } = query;

    return this.userModel
      .find({
        email: {
          $regex: keyword,
          $options: 'i',
        },
        ...(status && {
          status,
        }),
      })
      .count();
  };

  searchUserReviews = async (id, query) => {
    const { keyword = '', status, sortOrder = 'desc', page = 0, limit = 10 } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'product') {
      sortBy = 'product.title';
    }

    const result = await this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          reviews: '$reviews',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      { $unwind: '$reviews' },
      { $replaceRoot: { newRoot: '$reviews' } },
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
      // {
      //   $match: {
      //     $and: [
      //       {
      //         $or: [
      //           {
      //             'product.title': {
      //               $regex: keyword,
      //               $options: 'i',
      //             },
      //           },
      //         ],
      //       },
      //       {
      //         ...(status && {
      //           status,
      //         }),
      //       },
      //     ],
      //   },
      // },
      // { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      // { $skip: page * limit },
      // { $limit: limit },
    ]);

    return result;
  };

  getUserReviewsCount = async (id, query) => {
    const { keyword = '', status } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'product') {
      sortBy = 'product.title';
    }

    const result = await this.userModel.aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $project: {
          _id: 0,
          reviews: '$reviews',
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: 'reviews',
          foreignField: '_id',
          as: 'reviews',
        },
      },
      { $unwind: '$reviews' },
      { $replaceRoot: { newRoot: '$reviews' } },
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
        $match: {
          $and: [
            {
              $or: [
                {
                  'product.title': {
                    $regex: keyword,
                    $options: 'i',
                  },
                },
              ],
            },
            {
              ...(status && {
                status,
              }),
            },
          ],
        },
      },
      { $count: 'count' },
    ]);

    return result[0]?.count || 0;
  };

  addCoupon = (id, props) =>
    this.userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $push: {
            promoCodes: props,
          },
        },
        {
          new: true,
        },
      )
      .exec();

  deleteCoupon = (id, promoCodeId) =>
    this.userModel
      .findOneAndUpdate(
        { _id: id },
        {
          $pull: {
            promoCodes: promoCodeId,
          },
        },
        {
          new: true,
        },
      )
      .exec();
}
