import { Collection } from 'mongodb';
import { FeatureDto, FeatureMapper } from '../featureMapper';
import { FeatureDoc } from '../model';

type SearchFeaturesQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface FeatureQueriesRepoI {
  searchFeatures: (
    query: SearchFeaturesQueries,
  ) => Promise<{ features: FeatureDto[]; count: number }>;
  listFeatures: () => Promise<FeatureDto[]>;
  getFeature: (id: string) => Promise<FeatureDto | null>;
  getFeatureByName: (name: string) => Promise<FeatureDto | null>;
  getFeatureByPropsOr: (props: Array<Record<string, unknown>>) => Promise<FeatureDto | null>;
  getFeatures: (ids: string[]) => Promise<FeatureDto[]>;
}

export class FeatureQueriesRepo implements FeatureQueriesRepoI {
  constructor(private collection: Collection<FeatureDoc>) {}

  searchFeatures = async (
    query: SearchFeaturesQueries,
  ): Promise<{ features: FeatureDto[]; count: number }> => {
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
          features: [{ $skip: page }, { $limit: limit }],
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
          features: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      features: FeatureMapper.toDtoList(result.features),
      count: result.count,
    };
  };

  getFeature = async (id: string): Promise<FeatureDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return FeatureMapper.toDto(doc);
  };

  getFeatureByName = async (name: string): Promise<FeatureDto | null> => {
    const doc = this.collection.findOne({ name });
    if (!doc) return null;

    return FeatureMapper.toDto(doc);
  };

  listFeatures = async (): Promise<FeatureDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return FeatureMapper.toDtoList(docs);
  };

  getFeatureByPropsOr = async (props: Array<Record<string, any>>): Promise<FeatureDto | null> => {
    const doc = this.collection.findOne({ $or: props });
    if (!doc) return null;

    return FeatureMapper.toDto(doc);
  };

  getFeatures = async (ids: string[]): Promise<FeatureDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return FeatureMapper.toDtoList(docs);
  };
}
