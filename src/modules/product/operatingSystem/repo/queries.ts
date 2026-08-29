import { Collection, ObjectId } from 'mongodb';
import { OperatingSystemDoc } from '../model';
import { OperatingSystemDto, OperatingSystemMapper } from '../operatingSystemMapper';

type SearchOperatingSystemsQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface OperatingSystemQueriesRepoI {
  searchOperatingSystems: (
    query: SearchOperatingSystemsQueries,
  ) => Promise<{ operatingSystems: OperatingSystemDto[]; count: number }>;
  listOperatingSystems: () => Promise<OperatingSystemDto[]>;
  getOperatingSystem: (id: string) => Promise<OperatingSystemDto | null>;
  getOperatingSystemByName: (name: string) => Promise<OperatingSystemDto | null>;
  getOperatingSystemByPropsOr: (
    props: Array<Record<string, unknown>>,
  ) => Promise<OperatingSystemDto | null>;
  getOperatingSystems: (ids: string[]) => Promise<OperatingSystemDto[]>;
}

export class OperatingSystemQueriesRepo implements OperatingSystemQueriesRepoI {
  constructor(private collection: Collection<OperatingSystemDoc>) {}

  searchOperatingSystems = async (
    query: SearchOperatingSystemsQueries,
  ): Promise<{ operatingSystems: OperatingSystemDto[]; count: number }> => {
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
          operatingSystems: [{ $skip: page }, { $limit: limit }],
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
          operatingSystems: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      operatingSystems: OperatingSystemMapper.toDtoList(result.operatingSystems),
      count: result.count,
    };
  };

  getOperatingSystem = async (id: string): Promise<OperatingSystemDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return OperatingSystemMapper.toDto(doc);
  };

  getOperatingSystemByName = async (name: string): Promise<OperatingSystemDto | null> => {
    const doc = this.collection.findOne({ name });
    if (!doc) return null;

    return OperatingSystemMapper.toDto(doc);
  };

  listOperatingSystems = async (): Promise<OperatingSystemDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return OperatingSystemMapper.toDtoList(docs);
  };

  getOperatingSystemByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<OperatingSystemDto | null> => {
    const doc = this.collection.findOne({ $or: props });
    if (!doc) return null;

    return OperatingSystemMapper.toDto(doc);
  };

  getOperatingSystems = async (ids: string[]): Promise<OperatingSystemDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return OperatingSystemMapper.toDtoList(docs);
  };
}
