import { Collection } from 'mongodb';
import { DiscountDto, DiscountMapper, DiscountPopulatedDto } from '../discountMapper';
import { DiscountDoc, DiscountPopulatedDoc } from '../model';

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
  discounts: DiscountPopulatedDto[];
  count: number;
};

export interface DiscountQueriesRepoI {
  getDiscount: (id: string) => Promise<DiscountPopulatedDto | null>;
  searchDiscounts: (query: SearchDiscountsQueries) => Promise<SearchDiscountsResponse>;
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

export class DiscountQueriesRepo implements DiscountQueriesRepoI {
  constructor(private collection: Collection<DiscountDoc>) {}

  getDiscount = async (id: string): Promise<DiscountPopulatedDto | null> => {
    const doc = await this.collection
      .aggregate<DiscountPopulatedDoc>([
        { $match: { _id: id } },
        {
          $lookup: {
            from: 'products',
            localField: 'product',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
      ])
      .next();
    if (!doc) return null;

    return DiscountMapper.toPopulatedDto(doc);
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
    const intervalQueries = buildIntervalQuery(status);

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
          discounts: [
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
              $unwind: '$product',
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
      discounts: DiscountMapper.toPopulatedDtoList(result.discounts),
      count: result.count,
    };
  };
}
