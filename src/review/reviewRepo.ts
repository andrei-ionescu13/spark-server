import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Review } from './model';

export interface ReviewRepoI {
  createReview: any;
  deleteReview: any;
  getReview: any;
  searchReviews: any;
  getReviewsCount: any;
  updateReview: any;
}

export class ReviewRepo implements ReviewRepoI {
  constructor(private reviewModel: Model<Review>) {}

  createReview = (props) => this.reviewModel.create(props);

  deleteReview = (id) => this.reviewModel.deleteOne({ _id: id });

  getReview = (id) => this.reviewModel.findOne({ _id: id }).populate('product user').exec();

  searchReviews = async (query) => {
    const { keyword = '', status, sortOrder = 'desc', page = 0, limit = 10 } = query;

    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'product') {
      sortBy = 'product.title';
    }

    if (sortBy === 'user') {
      sortBy = 'user.email';
    }

    const result = await this.reviewModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $set: {
          product: { $arrayElemAt: ['$product', 0] },
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ['$user', 0] },
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
                {
                  'user.email': {
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
      { $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 } },
      { $skip: page * limit },
      { $limit: limit },
    ]);

    return result;
  };

  getReviewsCount = async (query) => {
    const { keyword = '', status } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'product') {
      sortBy = 'product.title';
    }

    if (sortBy === 'user') {
      sortBy = 'user.email';
    }

    const result = await this.reviewModel.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: 'product',
          foreignField: '_id',
          as: 'product',
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      {
        $set: {
          product: { $arrayElemAt: ['$product', 0] },
        },
      },
      {
        $set: {
          user: { $arrayElemAt: ['$user', 0] },
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
                {
                  'user.email': {
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

  updateReview = (id, props) =>
    this.reviewModel
      .findOneAndUpdate({ _id: id }, { $set: props }, { new: true })
      .populate('product user')
      .exec();
}
