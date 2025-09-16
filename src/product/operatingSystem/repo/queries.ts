import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { OperatingSystemDoc } from '../model';
import { OperatingSystemDto, OperatingSystemMapper } from '../operatingSystemMapper';

type SearchOperatingSystemsQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface OperatingSystemQueriesRepoI {
  searchOperatingSystems: (
    query: SearchOperatingSystemsQuery,
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
  constructor(private operatingSystemModel: Model<OperatingSystemDoc>) {}

  searchOperatingSystems = async (
    query: SearchOperatingSystemsQuery,
  ): Promise<{ operatingSystems: OperatingSystemDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const [result] = await this.operatingSystemModel.aggregate([
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
    ]);

    return {
      operatingSystems: OperatingSystemMapper.toDtoList(result.operatingSystems),
      count: result.count,
    };
  };

  getOperatingSystem = async (id: string): Promise<OperatingSystemDto | null> => {
    const doc = await this.operatingSystemModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return OperatingSystemMapper.toDto(doc);
  };

  getOperatingSystemByName = async (name: string): Promise<OperatingSystemDto | null> => {
    const doc = this.operatingSystemModel.findOne({ name }).lean();
    if (!doc) return null;

    return OperatingSystemMapper.toDto(doc);
  };

  listOperatingSystems = async (): Promise<OperatingSystemDto[]> => {
    const docs = await this.operatingSystemModel.find({});
    return OperatingSystemMapper.toDtoList(docs);
  };

  getOperatingSystemByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<OperatingSystemDto | null> => {
    const doc = this.operatingSystemModel.findOne({ $or: props }).lean();
    if (!doc) return null;

    return OperatingSystemMapper.toDto(doc);
  };

  getOperatingSystems = async (ids: string[]): Promise<OperatingSystemDto[]> => {
    const docs = await this.operatingSystemModel.find({ _id: { $in: ids } });
    return OperatingSystemMapper.toDtoList(docs);
  };
}
