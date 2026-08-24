import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CollectionDto, CollectionMapper } from '../collectionMapper';
import { CollectionDoc } from '../model';

type Status = 'expired' | 'active' | 'scheduled';

type SearchCollectionsQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
  status?: Status;
};

type SearchCollectionsResponse = {
  collections: CollectionDto[];
  count: number;
};

export interface CollectionQueriesRepoI {
  getCollection: (id: string) => Promise<CollectionDto | null>;
  searchCollections: (query: SearchCollectionsQuery) => Promise<SearchCollectionsResponse>;
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

export class CollectionQueriesRepo implements CollectionQueriesRepoI {
  constructor(private collectionModel: Model<CollectionDoc>) {}

  getCollection = async (id: string): Promise<CollectionDto | null> => {
    const doc = await this.collectionModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products')
      .lean();
    if (!doc) return null;

    return CollectionMapper.toDto(doc);
  };

  searchCollections = async (query: SearchCollectionsQuery): Promise<SearchCollectionsResponse> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    const [result] = await this.collectionModel.aggregate([
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
          collections: [{ $skip: page }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          collections: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ]);

    return {
      collections: CollectionMapper.toDtoList(result.collections),
      count: result.count,
    };
  };
}
