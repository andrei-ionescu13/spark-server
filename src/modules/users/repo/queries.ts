import { Collection, ObjectId } from 'mongodb';
import { UserDoc } from '../model';
import { UserDto, UserMapper } from '../userMapper';
import { ReviewDto, ReviewMapper } from '../../review/reviewMapper';

type SearchUsersQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  page?: number;
  limit: number;
};

type SearchUserReviewsQueries = {
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface UserQueriesRepoI {
  getUser: (id: string) => Promise<UserDto | null>;
  searchUsers: (query: SearchUsersQueries) => Promise<{ users: UserDto[]; count: number }>;
  searchUserReviews: (
    id: string,
    query: SearchUserReviewsQueries,
  ) => Promise<{ reviews: ReviewDto[]; count: number }>;
}

export class UserQueriesRepo implements UserQueriesRepoI {
  constructor(private collection: Collection<UserDoc>) {}

  getUser = async (id: string): Promise<UserDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return UserMapper.toDto(doc);
  };

  searchUsers = async (query: SearchUsersQueries): Promise<{ users: UserDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      page = 1,
      limit = 10,
    } = query;
    const pipeline = [
      {
        $match: {
          title: {
            $regex: keyword,
            $options: 'i',
          },
          ...(status && {
            status,
          }),
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          users: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: 'orders',
                localField: 'orders',
                foreignField: '_id',
                as: 'orders',
              },
            },
            {
              $lookup: {
                from: 'orders',
                localField: 'activeOrders',
                foreignField: '_id',
                as: 'orders',
              },
            },
          ],
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
      users: UserMapper.toDtoList(result.users),
      count: result.count,
    };
  };

  searchUserReviews = async (
    id: string,
    query: SearchUserReviewsQueries,
  ): Promise<{ reviews: any[]; count: number }> => {
    const { sortOrder = 'desc', page = 0, limit = 10 } = query;
    let { sortBy = 'createdAt' } = query;

    if (sortBy === 'product') {
      sortBy = 'product.title';
    }
    const pipeline = [
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
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          users: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
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
          ],
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
