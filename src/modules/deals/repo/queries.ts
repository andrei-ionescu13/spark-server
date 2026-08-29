import { Collection, ObjectId } from 'mongodb';
import { DealDoc } from '../model';
import { DealDto, DealMapper } from '../dealMapper';

interface SearchDealsQueries {
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  status: 'expired' | 'active' | 'scheduled';
}

export interface DealQueriesRepoI {
  getDeal: (id: string) => Promise<DealDto | null>;
  listDeals: (ids: string[]) => Promise<DealDto[]>;
  searchDeals: (query: SearchDealsQueries) => Promise<{ deals: DealDto[]; count: number }>;
}

const buildIntervalQueries = (status) => {
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

export class DealQueriesRepo implements DealQueriesRepoI {
  constructor(private collection: Collection<DealDoc>) {}

  getDeal = async (id: string) => {
    const doc = await this.collection
      .aggregate<DealDoc>([
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
      ])
      .next();

    if (!doc) return null;

    return DealMapper.toDto(doc);
  };

  listDeals = async (ids: string[]) => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return DealMapper.toDtoList(docs);
  };

  searchDeals = async (query: SearchDealsQueries) => {
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
          deals: [{ $skip: page }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          deals: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      deals: DealMapper.toDtoList(result.deals),
      count: result.count,
    };
  };
}
