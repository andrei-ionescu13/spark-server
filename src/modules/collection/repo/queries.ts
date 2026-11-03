import { Collection, ObjectId } from 'mongodb';
import { CollectionDto, CollectionMapper, CollectionPopulatedDto } from '../collectionMapper';
import { CollectionDoc, CollectionPopulatedDoc } from '../model';

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
  collections: CollectionPopulatedDto[];
  count: number;
};

export interface CollectionQueriesRepoI {
  getCollection: (id: string) => Promise<CollectionPopulatedDto | null>;
  searchCollections: (query: SearchCollectionsQueries) => Promise<SearchCollectionsResponse>;
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

export class CollectionQueriesRepo implements CollectionQueriesRepoI {
  constructor(private collection: Collection<CollectionDoc>) {}

  getCollection = async (id: string): Promise<CollectionPopulatedDto | null> => {
    const doc = await this.collection
      .aggregate<CollectionPopulatedDoc>([
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

    return CollectionMapper.toPopulatedDto(doc);
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
          collections: [
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
          collections: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      collections: CollectionMapper.toPopulatedDtoList(result.collections),
      count: result.count,
    };
  };
}
