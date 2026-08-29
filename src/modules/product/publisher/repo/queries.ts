import { Collection, ObjectId } from 'mongodb';
import { PublisherDoc } from '../model';
import { PublisherDto, PublisherMapper } from '../publisherMapper';

type SearchPublishersQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface PublisherQueriesRepoI {
  searchPublishers: (
    query: SearchPublishersQueries,
  ) => Promise<{ publishers: PublisherDto[]; count: number }>;
  listPublishers: () => Promise<PublisherDto[]>;
  getPublisher: (id: string) => Promise<PublisherDto | null>;
  getPublisherByName: (name: string) => Promise<PublisherDto | null>;
  getPublisherByPropsOr: (props: Array<Record<string, unknown>>) => Promise<PublisherDto | null>;
  getPublishers: (ids: string[]) => Promise<PublisherDto[]>;
}

export class PublisherQueriesRepo implements PublisherQueriesRepoI {
  constructor(private collection: Collection<PublisherDoc>) {}

  searchPublishers = async (
    query: SearchPublishersQueries,
  ): Promise<{ publishers: PublisherDto[]; count: number }> => {
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      publishers: PublisherMapper.toDtoList(result.publishers),
      count: result.count,
    };
  };

  getPublisher = async (id: string): Promise<PublisherDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return PublisherMapper.toDto(doc);
  };

  getPublisherByName = async (name: string): Promise<PublisherDto | null> => {
    const doc = this.collection.findOne({ name });
    if (!doc) return null;

    return PublisherMapper.toDto(doc);
  };

  listPublishers = async (): Promise<PublisherDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return PublisherMapper.toDtoList(docs);
  };

  getPublisherByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<PublisherDto | null> => {
    const doc = this.collection.findOne({ $or: props });
    if (!doc) return null;

    return PublisherMapper.toDto(doc);
  };

  getPublishers = async (ids: string[]): Promise<PublisherDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return PublisherMapper.toDtoList(docs);
  };
}
