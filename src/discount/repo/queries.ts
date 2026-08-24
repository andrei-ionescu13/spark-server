import { Model } from 'mongoose';
import { DiscountDto, DiscountMapper } from '../discountMapper';
import { DiscountDoc } from '../model';

type Status = 'expired' | 'active' | 'scheduled';

type SearchDiscountsQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
  status?: Status;
};

type SearchDiscountsResponse = {
  discounts: DiscountDto[];
  count: number;
};

export interface DiscountQueriesRepoI {
  getDiscount: (id: string) => Promise<DiscountDto | null>;
  searchDiscounts: (query: SearchDiscountsQuery) => Promise<SearchDiscountsResponse>;
}

const buildIntervalQuery = (status?: Status) => {
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

export class DiscountQueriesRepo implements DiscountQueriesRepoI {
  constructor(private discountModel: Model<DiscountDoc>) {}

  getDiscount = async (id: string): Promise<DiscountDto | null> => {
    const doc = await this.discountModel.findOne({ _id: id }).lean();
    if (!doc) null;

    return DiscountMapper.toDto(doc);
  };

  searchDiscounts = async (query: SearchDiscountsQuery): Promise<SearchDiscountsResponse> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    const [result] = await this.discountModel.aggregate([
      {
        $match: {
          $and: [
            {
              title: {
                $regex: keyword,
                $options: 'i',
              },
            },
            intervalQuery,
          ],
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          discounts: [{ $skip: page }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          discounts: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ]);

    return {
      discounts: DiscountMapper.toDtoList(result.discounts),
      count: result.count,
    };
  };
}
