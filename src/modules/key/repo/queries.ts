import { Collection } from 'mongodb';
import { KeyDto, KeyMapper } from '../keyMapper';
import { KeyDoc } from '../model';

type SearchKeysQueries = {
  keyword?: string;
  page?: number;
  limit: number;
  status?: string;
};

type SearchKeysResponse = {
  keys: KeyDto[];
  count: number;
};

export interface KeyQueriesRepoI {
  getKeyByValue: (value: string) => Promise<KeyDto | null>;
  getKeyByValueAndPlatform: (value: string, platformId: string) => Promise<KeyDto | null>;
  getKey: (id: string) => Promise<KeyDto | null>;
  searchKeys: (query: SearchKeysQueries) => Promise<SearchKeysResponse>;
}

export class KeyQueriesRepo implements KeyQueriesRepoI {
  constructor(private collection: Collection<KeyDoc>) {}

  getKey = async (id: string): Promise<KeyDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return KeyMapper.toDto(doc);
  };

  getKeyByValue = async (value: string): Promise<KeyDto | null> => {
    const doc = await this.collection.findOne({ value });
    if (!doc) return null;

    return KeyMapper.toDto(doc);
  };

  getKeyByValueAndPlatform = async (value: string, platformId: string): Promise<KeyDto | null> => {
    const doc = await this.collection.findOne({ value, platform: platformId });
    if (!doc) return null;

    return KeyMapper.toDto(doc);
  };

  searchKeys = async (query: SearchKeysQueries): Promise<SearchKeysResponse> => {
    const { keyword = '', status, page = 1, limit = 10 } = query;

    const pipeline = [
      {
        $match: {
          value: {
            $regex: keyword,
            $options: 'i',
          },
          ...(status && {
            status: status,
          }),
        },
      },
      {
        $sort: {
          createdAt: 1,
        },
      },
      {
        $facet: {
          count: [{ $count: 'count' }],
          keys: [
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
            { $unwind: '$product' },
          ],
        },
      },
      {
        $addFields: {
          count: {
            $arrayElemAt: ['$count', 0],
          },
        },
      },
      {
        $project: {
          count: '$count.count',
          keys: '$keys',
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      count: result.count,
      keys: KeyMapper.toDtoList(result.keys),
    };
  };
}
