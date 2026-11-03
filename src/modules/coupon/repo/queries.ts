import { Collection } from 'mongodb';
import { CouponDto, CouponMapper } from '../couponMapper';
import { CouponDoc } from '../model';

interface SearchCouponsQueries {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit: number;
  status?: 'expired' | 'active' | 'scheduled';
}

export interface CouponQueriesRepoI {
  getCoupon: (id: string) => Promise<CouponDto | null>;
  listCoupons: () => Promise<CouponDto[] | null>;
  searchCoupons: (query: SearchCouponsQueries) => Promise<{ coupons: CouponDto[]; count: number }>;
}

const buildIntervalQuery = (status?: 'expired' | 'active' | 'scheduled') => {
  const now = new Date();

  if (status === 'expired') {
    return {
      endDate: {
        $exists: true,
        $ne: null,
        $lte: now,
      },
    };
  }

  if (status === 'active') {
    return {
      startDate: {
        $lte: now,
      },
      $or: [{ endDate: { $gt: now } }, { endDate: null }],
    };
  }

  if (status === 'scheduled') {
    return {
      startDate: {
        $gt: now,
      },
      $or: [{ endDate: { $gt: now } }, { endDate: null }],
    };
  }

  return {};
};

export class CouponQueriesRepo implements CouponQueriesRepoI {
  constructor(private collection: Collection<CouponDoc>) {}
  getCoupon = async (id: string): Promise<CouponDto | null> => {
    const doc = await this.collection
      .aggregate([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products',
            foreignField: '_id',
            as: 'products',
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'users',
            foreignField: '_id',
            as: 'users',
          },
        },
      ])
      .next();
    return CouponMapper.toDto(doc);
  };

  listCoupons = async (): Promise<CouponDto[] | null> => {
    const docs = await this.collection.find({}).toArray();
    return CouponMapper.toDtoList(docs);
  };

  searchCoupons = async (
    query: SearchCouponsQueries,
  ): Promise<{ coupons: CouponDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQueries = buildIntervalQuery(status);
    const pipeline = [
      {
        $match: {
          code: {
            $regex: keyword,
            $options: 'i',
          },
          ...intervalQueries,
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          coupons: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'products',
              },
            },
            {
              $lookup: {
                from: 'users',
                localField: 'users',
                foreignField: '_id',
                as: 'users',
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
      coupons: CouponMapper.toDtoList(result.coupons),
      count: result.count,
    };
  };
}
