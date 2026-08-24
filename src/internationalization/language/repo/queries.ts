import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { LanguageDto, LanguageMapper } from '../languageMapper';
import { LanguageDoc } from '../model';

type SearchLanguagesQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface LanguageQueriesRepoI {
  searchLanguages: (
    query: SearchLanguagesQuery,
  ) => Promise<{ languages: LanguageDto[]; count: number }>;
  getLanguage: (id: string) => Promise<LanguageDto | null>;
  listLanguages: () => Promise<LanguageDto[]>;
}

export class LanguageQueriesRepo implements LanguageQueriesRepoI {
  constructor(private languageModel: Model<LanguageDoc>) {}

  searchLanguages = async (
    query: SearchLanguagesQuery,
  ): Promise<{ languages: LanguageDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const [result] = await this.languageModel.aggregate([
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
    ]);

    return {
      languages: LanguageMapper.toDtoList(result.languages),
      count: result.count,
    };
  };

  getLanguage = async (id: string): Promise<LanguageDto | null> => {
    const doc = await this.languageModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return LanguageMapper.toDto(doc);
  };

  listLanguages = async () => {
    const docs = await this.languageModel.find({});
    return LanguageMapper.toDtoList(docs);
  };
}
