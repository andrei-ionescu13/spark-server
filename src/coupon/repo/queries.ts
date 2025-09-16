import { Model } from 'mongoose';
import { CouponDto, CouponMapper } from '../couponMapper';
import { CouponDoc } from '../model';

interface SearchCouponsQuery {
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
  searchCoupons: (query: SearchCouponsQuery) => Promise<{ coupons: CouponDto[]; count: number }>;
  getCouponsCount: (query: SearchCouponsQuery) => Promise<number>;
}

const buildIntervalQuery = (status?: 'expired' | 'active' | 'scheduled') => {
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

export class CouponQueriesRepo implements CouponQueriesRepoI {
  constructor(private promoCodeModel: Model<CouponDoc>) {}
  getCoupon = async (id: string): Promise<CouponDto | null> => {
    const doc = await this.promoCodeModel.findOne({ _id: id }).populate('products users').lean();
    return CouponMapper.toDto(doc);
  };

  listCoupons = async (): Promise<CouponDto[] | null> => {
    const docs = await this.promoCodeModel.find({});
    return CouponMapper.toDtoList(docs);
  };

  searchCoupons = async (
    query: SearchCouponsQuery,
  ): Promise<{ coupons: CouponDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'asc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    const [result] = await this.promoCodeModel.aggregate([
      {
        $match: {
          title: {
            $regex: keyword,
            $options: 'i',
          },
          ...intervalQuery,
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
    ]);

    return {
      coupons: CouponMapper.toDtoList(result.coupons),
      count: result.count,
    };
  };

  getCouponsCount = async (query: SearchCouponsQuery): Promise<number> => {
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
}
