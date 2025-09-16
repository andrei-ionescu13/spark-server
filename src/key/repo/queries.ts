import { Model } from 'mongoose';
import { KeyDto, KeyMapper } from '../keyMapper';
import { KeyDoc } from '../model';

type SearchKeysQuery = {
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
  getKey: (id: string) => Promise<KeyDto | null>;
  searchKeys: (query: SearchKeysQuery) => Promise<SearchKeysResponse>;
}

export class KeyQueriesRepo implements KeyQueriesRepoI {
  constructor(private keyModel: Model<KeyDoc>) {}

  getKey = async (id: string): Promise<KeyDto | null> => {
    const doc = await this.keyModel.findOne({ _id: id }).lean();
    if (!doc) return null;

    return KeyMapper.toDto(doc);
  };

  getKeyByValue = async (value: string): Promise<KeyDto | null> => {
    const doc = await this.keyModel.findOne({ value }).lean();
    if (!doc) return null;

    return KeyMapper.toDto(doc);
  };

  searchKeys = async (query: SearchKeysQuery): Promise<SearchKeysResponse> => {
    const { keyword = '', status, page = 1, limit = 10 } = query;

    const [result] = await this.keyModel
      .aggregate([
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
      ])
      .exec();

    return {
      count: result.count,
      keys: KeyMapper.toDtoList(result.keys),
    };
  };
}
