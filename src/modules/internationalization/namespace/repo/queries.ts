import { NamespaceDoc } from '../model';
import { NamespaceDto, NamespaceMapper } from '../namespaceMapper';
import { Collection } from 'mongodb';

type SearchTranslationsQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
  languageCodes?: string[];
};

type SearchNamespaceTranslationsResult = {
  name: string;
  _id: string;
  count: number;
  translations: Array<Record<string, string>>;
};

export interface NamespaceQueriesRepoI {
  getNamespaceByName: (name: string) => Promise<NamespaceDto | null>;
  getNamespace: (id: string, props?: Record<string, string>) => Promise<NamespaceDto | null>;
  listNamespaces: () => Promise<NamespaceDto[]>;
  searchTranslations: (
    query: SearchTranslationsQueries,
  ) => Promise<{ namespaces: NamespaceDto[]; count: number }>;
  searchNamespaceTranslations: (
    id: string,
    query: SearchTranslationsQueries,
  ) => Promise<SearchNamespaceTranslationsResult>;
}

export class NamespaceQueriesRepo implements NamespaceQueriesRepoI {
  constructor(private collection: Collection<NamespaceDoc>) {}

  getNamespaceByName = async (name: string): Promise<NamespaceDto | null> => {
    const doc = await this.collection.findOne({ name });
    if (!doc) return null;

    return NamespaceMapper.toDto(doc);
  };

  getNamespace = async (id: string, props = {}): Promise<NamespaceDto | null> => {
    const doc = await this.collection.findOne({ _id: id, ...props });
    if (!doc) return null;

    return NamespaceMapper.toDto(doc);
  };

  listNamespaces = async (): Promise<NamespaceDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return NamespaceMapper.toDtoList(docs);
  };

  searchTranslations = async (
    query: SearchTranslationsQueries,
  ): Promise<{ namespaces: NamespaceDto[]; count: number }> => {
    const {
      keyword = '',
      page = 1,
      limit = 10,
      sortBy = 'name',
      sortOrder = 'asc',
      languageCodes = [],
    } = query;
    const orQueries = languageCodes.map((code) => ({
      [`translations.${code}`]: {
        $regex: keyword,
        $options: 'i',
      },
    }));
    const pipeline = [
      {
        $match: {
          $or: [
            {
              name: {
                $regex: keyword,
                $options: 'i',
              },
            },
            {
              'translations.key': {
                $regex: keyword,
                $options: 'i',
              },
            },
            ...orQueries,
          ],
        },
      },
      {
        $unwind: {
          path: '$translations',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              name: {
                $regex: keyword,
                $options: 'i',
              },
            },
            {
              'translations.key': {
                $regex: keyword,
                $options: 'i',
              },
            },
            ...orQueries,
          ],
        },
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
          translations: {
            $push: '$translations',
          },
        },
      },
      {
        $sort: { [sortBy]: sortOrder === 'asc' ? 1 : -1 },
      },
      {
        $facet: {
          namespaces: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          count: [{ $count: 'count' }],
        },
      },
      {
        $project: {
          namespaces: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      namespaces: NamespaceMapper.toDtoList(result.namespaces),
      count: result.count,
    };
  };

  searchNamespaceTranslations = async (
    id: string,
    query: SearchTranslationsQueries,
  ): Promise<SearchNamespaceTranslationsResult> => {
    const {
      keyword = '',
      page = 1,
      limit,
      sortBy = 'key',
      sortOrder = 'asc',
      languageCodes = [],
    } = query;

    const orQueries = languageCodes.map((code) => ({
      [`translations.${code}`]: {
        $regex: keyword,
        $options: 'i',
      },
    }));

    const pipeline = [
      { $match: { _id: id } },
      {
        $facet: {
          data: [
            {
              $project: {
                name: '$name',
              },
            },
          ],
          translations: [
            { $unwind: '$translations' },
            {
              $match: {
                $or: [
                  {
                    'translations.key': {
                      $regex: keyword,
                      $options: 'i',
                    },
                  },
                  ...orQueries,
                ],
              },
            },
            {
              $sort: {
                [`translations.${sortBy}`]: sortOrder === 'asc' ? 1 : -1,
              },
            },
            { $skip: (page - 1) * limit },
            { $limit: limit },
          ],
          count: [
            {
              $group: {
                count: { $sum: 1 },
                _id: '$_id',
                translations: {
                  $push: '$translations',
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          data: {
            $arrayElemAt: ['$data', 0],
          },
          translations: {
            $arrayElemAt: ['$translations', 0],
          },
          count: {
            $arrayElemAt: ['$count', 0],
          },
        },
      },
      {
        $project: {
          name: '$data.name',
          _id: '$data._id',
          count: '$translations.count',
          translations: '$translations.translations',
        },
      },
      {
        $project: {
          name: 1,
          _id: 1,
          count: { $ifNull: ['$count', 0] },
          translations: { $ifNull: ['$translations', []] },
        },
      },
    ];
    const [result] = await this.collection
      .aggregate<{
        name: string;
        _id: string;
        count: number;
        translations: Record<string, string>[];
      }>(pipeline)
      .toArray();

    return {
      name: result.name,
      _id: result._id,
      count: result.count,
      translations: result.translations,
    };
  };
}
