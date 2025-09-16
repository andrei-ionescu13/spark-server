import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { DeveloperDto, DeveloperMapper } from '../developerMapper';
import { DeveloperDoc } from '../model';

type SearchDevelopersQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface DeveloperQueriesRepoI {
  searchDevelopers: (
    query: SearchDevelopersQuery,
  ) => Promise<{ developers: DeveloperDto[]; count: number }>;
  listDevelopers: () => Promise<DeveloperDto[]>;
  getDeveloper: (id: string) => Promise<DeveloperDto | null>;
  getDeveloperByName: (name: string) => Promise<DeveloperDto | null>;
  getDeveloperByPropsOr: (props: Array<Record<string, unknown>>) => Promise<DeveloperDto | null>;
  getDevelopers: (ids: string[]) => Promise<DeveloperDto[]>;
}

export class DeveloperQueriesRepo implements DeveloperQueriesRepoI {
  constructor(private developerModel: Model<DeveloperDoc>) {}

  searchDevelopers = async (
    query: SearchDevelopersQuery,
  ): Promise<{ developers: DeveloperDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const [result] = await this.developerModel.aggregate([
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
          developers: [{ $skip: page }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
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
        $addFields: {
          count: '$count.count',
        },
      },
      {
        $project: {
          developers: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return {
      developers: DeveloperMapper.toDtoList(result.developers),
      count: result.count,
    };
  };

  getDeveloper = async (id: string): Promise<DeveloperDto | null> => {
    const doc = await this.developerModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return DeveloperMapper.toDto(doc);
  };

  getDeveloperByName = async (name: string): Promise<DeveloperDto | null> => {
    const doc = this.developerModel.findOne({ name }).lean();
    if (!doc) return null;

    return DeveloperMapper.toDto(doc);
  };

  listDevelopers = async (): Promise<DeveloperDto[]> => {
    const docs = await this.developerModel.find({});
    return DeveloperMapper.toDtoList(docs);
  };

  getDeveloperByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<DeveloperDto | null> => {
    const doc = this.developerModel.findOne({ $or: props }).lean();
    if (!doc) return null;

    return DeveloperMapper.toDto(doc);
  };

  getDevelopers = async (ids: string[]): Promise<DeveloperDto[]> => {
    const docs = await this.developerModel.find({ _id: { $in: ids } });
    return DeveloperMapper.toDtoList(docs);
  };
}
