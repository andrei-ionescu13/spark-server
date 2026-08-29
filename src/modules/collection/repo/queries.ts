import { Collection, ObjectId } from 'mongodb';
import { CollectionDto, CollectionMapper } from '../collectionMapper';
import { CollectionDoc } from '../model';

type Status = 'expired' | 'active' | 'scheduled';

type SearchCollectionsQueries = {
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
  searchCollections: (query: SearchCollectionsQueries) => Promise<SearchCollectionsResponse>;
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

export class CollectionQueriesRepo implements CollectionQueriesRepoI {
  constructor(private collection: Collection<CollectionDoc>) {}

  getCollection = async (id: string): Promise<CollectionDto | null> => {
    const doc = await this.collection
      .aggregate<CollectionDoc>([
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

    return CollectionMapper.toDto(doc);
  };

  searchCollections = async (
    query: SearchCollectionsQueries,
  ): Promise<SearchCollectionsResponse> => {
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      collections: CollectionMapper.toDtoList(result.collections),
      count: result.count,
    };
  };
}
