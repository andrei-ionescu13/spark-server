import { Collection } from 'mongodb';
import { DiscountDto, DiscountMapper } from '../discountMapper';
import { DiscountDoc } from '../model';

type Status = 'expired' | 'active' | 'scheduled';

type SearchDiscountsQueries = {
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
  searchDiscounts: (query: SearchDiscountsQueries) => Promise<SearchDiscountsResponse>;
}

const buildIntervalQueries = (status?: Status) => {
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
  constructor(private collection: Collection<DiscountDoc>) {}

  getDiscount = async (id: string): Promise<DiscountDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) null;

    return DiscountMapper.toDto(doc);
  };

  searchDiscounts = async (query: SearchDiscountsQueries): Promise<SearchDiscountsResponse> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQueries = buildIntervalQueries(status);
    const pipeline = [
      {
        $match: {
          $and: [
            {
              title: {
                $regex: keyword,
                $options: 'i',
              },
            },
            intervalQueries,
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      discounts: DiscountMapper.toDtoList(result.discounts),
      count: result.count,
    };
  };
}
