import { Model } from 'mongoose';
import { ReviewDoc } from '../model';
import { ReviewDto, ReviewMapper } from '../reviewMapper';

interface SearchReviewsQuery {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit: number;
  status?: 'published' | 'unpublished' | 'flagged';
}

export interface ReviewQueriesRepoI {
  getReview: (id: string) => Promise<ReviewDto | null>;
  searchReviews: (query: SearchReviewsQuery) => Promise<{
    reviews: ReviewDto[];
    count: number;
  }>;
}

export class ReviewQueriesRepo implements ReviewQueriesRepoI {
  constructor(private reviewModel: Model<ReviewDoc>) {}

  getReview = async (id: string): Promise<ReviewDto | null> => {
    const doc = await this.reviewModel.findOne({ _id: id }).populate('product user').exec();
    if (!doc) return null;

    return ReviewMapper.toDto(doc);
  };

  searchReviews = async (
    query: SearchReviewsQuery,
  ): Promise<{
    reviews: ReviewDto[];
    count: number;
  }> => {
    const { keyword = '', status, sortOrder = 'desc', page = 1, limit = 10 } = query;

    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'product') {
      sortBy = 'product.title';
    }

    if (sortBy === 'user') {
      sortBy = 'user.email';
    }

    const [result] = await this.reviewModel.aggregate([
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
      {
        $facet: {
          reviews: [{ $skip: (page - 1) * limit }, { $limit: limit }],
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
      reviews: ReviewMapper.toDtoList(result.reviews),
      count: result.count,
    };
  };
}
