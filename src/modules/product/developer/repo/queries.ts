import { Collection, ObjectId } from 'mongodb';
import { DeveloperDto, DeveloperMapper } from '../developerMapper';
import { DeveloperDoc } from '../model';

type SearchDevelopersQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface DeveloperQueriesRepoI {
  searchDevelopers: (
    query: SearchDevelopersQueries,
  ) => Promise<{ developers: DeveloperDto[]; count: number }>;
  listDevelopers: () => Promise<DeveloperDto[]>;
  getDeveloper: (id: string) => Promise<DeveloperDto | null>;
  getDeveloperByName: (name: string) => Promise<DeveloperDto | null>;
  getDeveloperByPropsOr: (props: Array<Record<string, unknown>>) => Promise<DeveloperDto | null>;
  getDevelopers: (ids: string[]) => Promise<DeveloperDto[]>;
}

export class DeveloperQueriesRepo implements DeveloperQueriesRepoI {
  constructor(private collection: Collection<DeveloperDoc>) {}

  searchDevelopers = async (
    query: SearchDevelopersQueries,
  ): Promise<{ developers: DeveloperDto[]; count: number }> => {
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      developers: DeveloperMapper.toDtoList(result.developers),
      count: result.count,
    };
  };

  getDeveloper = async (id: string): Promise<DeveloperDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return DeveloperMapper.toDto(doc);
  };

  getDeveloperByName = async (name: string): Promise<DeveloperDto | null> => {
    const doc = this.collection.findOne({ name });
    if (!doc) return null;

    return DeveloperMapper.toDto(doc);
  };

  listDevelopers = async (): Promise<DeveloperDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return DeveloperMapper.toDtoList(docs);
  };

  getDeveloperByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<DeveloperDto | null> => {
    const doc = this.collection.findOne({ $or: props });
    if (!doc) return null;

    return DeveloperMapper.toDto(doc);
  };

  getDevelopers = async (ids: string[]): Promise<DeveloperDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return DeveloperMapper.toDtoList(docs);
  };
}
