import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { DealDoc } from '../model';
import { DealDto, DealMapper } from '../dealMapper';

interface SearchDealsQuery {
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
  searchDeals: (query: SearchDealsQuery) => Promise<{ deals: DealDto[]; count: number }>;
}

const buildIntervalQuery = (status) => {
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
  constructor(private dealModel: Model<DealDoc>) {}

  getDeal = async (id: string) => {
    const doc = await this.dealModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products')
      .lean();

    if (!doc) return null;

    return DealMapper.toDto(doc);
  };

  listDeals = async (ids: string[]) => {
    const docs = await this.dealModel.find({ _id: { $in: ids } });
    return DealMapper.toDtoList(docs);
  };

  searchDeals = async (query: SearchDealsQuery) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    const [result] = await this.dealModel.aggregate([
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
    ]);

    return {
      deals: DealMapper.toDtoList(result.deals),
      count: result.count,
    };
  };
}
