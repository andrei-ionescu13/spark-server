import { ReviewDoc } from '../model';
import { ReviewDto, ReviewMapper } from '../reviewMapper';
import { Collection } from 'mongodb';

interface SearchReviewsQueries {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit: number;
  status?: 'published' | 'unpublished' | 'flagged';
}

export interface ReviewQueriesRepoI {
  getReview: (id: string) => Promise<ReviewDto | null>;
  searchReviews: (query: SearchReviewsQueries) => Promise<{
    reviews: ReviewDto[];
    count: number;
  }>;
  getReviews: (ids: string[]) => Promise<ReviewDto[]>;
}

export class ReviewQueriesRepo implements ReviewQueriesRepoI {
  constructor(private collection: Collection<ReviewDoc>) {}

  getReview = async (id: string): Promise<ReviewDto | null> => {
    const doc = await this.collection
      .aggregate<ReviewDoc>([
        { $match: { _id: id } },

        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product',
          },
        },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },

        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user',
          },
        },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      ])
      .next();
    if (!doc) return null;

    return ReviewMapper.toDto(doc);
  };

  getReviews = async (ids: string[]): Promise<ReviewDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return ReviewMapper.toDtoList(docs);
  };

  searchReviews = async (
    query: SearchReviewsQueries,
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

    const pipeline = [
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      reviews: ReviewMapper.toDtoList(result.reviews),
      count: result.count,
    };
  };
}
