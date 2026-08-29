import { Collection, ObjectId } from 'mongodb';
import { LanguageDto, LanguageMapper } from '../languageMapper';
import { LanguageDoc } from '../model';

type SearchLanguagesQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface LanguageQueriesRepoI {
  searchLanguages: (
    query: SearchLanguagesQueries,
  ) => Promise<{ languages: LanguageDto[]; count: number }>;
  getLanguage: (id: string) => Promise<LanguageDto | null>;
  listLanguages: () => Promise<LanguageDto[]>;
}

export class LanguageQueriesRepo implements LanguageQueriesRepoI {
  constructor(private collection: Collection<LanguageDoc>) {}

  searchLanguages = async (
    query: SearchLanguagesQueries,
  ): Promise<{ languages: LanguageDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;
    const pipeline = [
      {
        $match: {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          languages: [{ $skip: page }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          languages: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      languages: LanguageMapper.toDtoList(result.languages),
      count: result.count,
    };
  };

  getLanguage = async (id: string): Promise<LanguageDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return LanguageMapper.toDto(doc);
  };

  listLanguages = async () => {
    const docs = await this.collection.find({}).toArray();
    return LanguageMapper.toDtoList(docs);
  };
}
