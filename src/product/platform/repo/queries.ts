import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { PlatformDoc } from '../model';
import { PlatformDto, PlatformMapper } from '../platformMapper';

type SearchPlatformsQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface PlatformQueriesRepoI {
  searchPlatforms: (
    query: SearchPlatformsQuery,
  ) => Promise<{ platforms: PlatformDto[]; count: number }>;
  listPlatforms: () => Promise<PlatformDto[]>;
  getPlatform: (id: string) => Promise<PlatformDto | null>;
  getPlatformByName: (name: string) => Promise<PlatformDto | null>;
  getPlatformByPropsOr: (props: Array<Record<string, unknown>>) => Promise<PlatformDto | null>;
  getPlatforms: (ids: string[]) => Promise<PlatformDto[]>;
}

export class PlatformQueriesRepo implements PlatformQueriesRepoI {
  constructor(private platformModel: Model<PlatformDoc>) {}

  searchPlatforms = async (
    query: SearchPlatformsQuery,
  ): Promise<{ platforms: PlatformDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const [result] = await this.platformModel.aggregate([
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
          platforms: [{ $skip: page }, { $limit: limit }],
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
          platforms: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return {
      platforms: PlatformMapper.toDtoList(result.platforms),
      count: result.count,
    };
  };

  getPlatform = async (id: string): Promise<PlatformDto | null> => {
    const doc = await this.platformModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return PlatformMapper.toDto(doc);
  };

  getPlatformByName = async (name: string): Promise<PlatformDto | null> => {
    const doc = this.platformModel.findOne({ name }).lean();
    if (!doc) return null;

    return PlatformMapper.toDto(doc);
  };

  listPlatforms = async (): Promise<PlatformDto[]> => {
    const docs = await this.platformModel.find({});
    return PlatformMapper.toDtoList(docs);
  };

  getPlatformByPropsOr = async (props: Array<Record<string, any>>): Promise<PlatformDto | null> => {
    const doc = this.platformModel.findOne({ $or: props }).lean();
    if (!doc) return null;

    return PlatformMapper.toDto(doc);
  };

  getPlatforms = async (ids: string[]): Promise<PlatformDto[]> => {
    const docs = await this.platformModel.find({ _id: { $in: ids } });
    return PlatformMapper.toDtoList(docs);
  };
}
