import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { PublisherDoc } from '../model';
import { PublisherDto, PublisherMapper } from '../publisherMapper';

type SearchPublishersQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface PublisherQueriesRepoI {
  searchPublishers: (
    query: SearchPublishersQuery,
  ) => Promise<{ publishers: PublisherDto[]; count: number }>;
  listPublishers: () => Promise<PublisherDto[]>;
  getPublisher: (id: string) => Promise<PublisherDto | null>;
  getPublisherByName: (name: string) => Promise<PublisherDto | null>;
  getPublisherByPropsOr: (props: Array<Record<string, unknown>>) => Promise<PublisherDto | null>;
  getPublishers: (ids: string[]) => Promise<PublisherDto[]>;
}

export class PublisherQueriesRepo implements PublisherQueriesRepoI {
  constructor(private publisherModel: Model<PublisherDoc>) {}

  searchPublishers = async (
    query: SearchPublishersQuery,
  ): Promise<{ publishers: PublisherDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const [result] = await this.publisherModel.aggregate([
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
          publishers: [{ $skip: page }, { $limit: limit }],
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
          publishers: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return {
      publishers: PublisherMapper.toDtoList(result.publishers),
      count: result.count,
    };
  };

  getPublisher = async (id: string): Promise<PublisherDto | null> => {
    const doc = await this.publisherModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return PublisherMapper.toDto(doc);
  };

  getPublisherByName = async (name: string): Promise<PublisherDto | null> => {
    const doc = this.publisherModel.findOne({ name }).lean();
    if (!doc) return null;

    return PublisherMapper.toDto(doc);
  };

  listPublishers = async (): Promise<PublisherDto[]> => {
    const docs = await this.publisherModel.find({});
    return PublisherMapper.toDtoList(docs);
  };

  getPublisherByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<PublisherDto | null> => {
    const doc = this.publisherModel.findOne({ $or: props }).lean();
    if (!doc) return null;

    return PublisherMapper.toDto(doc);
  };

  getPublishers = async (ids: string[]): Promise<PublisherDto[]> => {
    const docs = await this.publisherModel.find({ _id: { $in: ids } });
    return PublisherMapper.toDtoList(docs);
  };
}
