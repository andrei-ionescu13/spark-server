import { Collection, ObjectId } from 'mongodb';
import { GenreDto, GenreMapper } from '../genreMapper';
import { GenreDoc } from '../model';

type SearchGenresQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface GenreQueriesRepoI {
  searchGenres: (query: SearchGenresQueries) => Promise<{ genres: GenreDto[]; count: number }>;
  listGenres: () => Promise<GenreDto[]>;
  getGenre: (id: string) => Promise<GenreDto | null>;
  getGenreByName: (name: string) => Promise<GenreDto | null>;
  getGenreByPropsOr: (props: Array<Record<string, unknown>>) => Promise<GenreDto | null>;
  getGenres: (ids: string[]) => Promise<GenreDto[]>;
}

export class GenreQueriesRepo implements GenreQueriesRepoI {
  constructor(private collection: Collection<GenreDoc>) {}

  searchGenres = async (
    query: SearchGenresQueries,
  ): Promise<{ genres: GenreDto[]; count: number }> => {
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
          genres: [{ $skip: page }, { $limit: limit }],
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
          genres: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      genres: GenreMapper.toDtoList(result.genres),
      count: result.count,
    };
  };

  getGenre = async (id: string): Promise<GenreDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return GenreMapper.toDto(doc);
  };

  getGenreByName = async (name: string): Promise<GenreDto | null> => {
    const doc = this.collection.findOne({ name });
    if (!doc) return null;

    return GenreMapper.toDto(doc);
  };

  listGenres = async (): Promise<GenreDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return GenreMapper.toDtoList(docs);
  };

  getGenreByPropsOr = async (props: Array<Record<string, any>>): Promise<GenreDto | null> => {
    const doc = this.collection.findOne({ $or: props });
    if (!doc) return null;

    return GenreMapper.toDto(doc);
  };

  getGenres = async (ids: string[]): Promise<GenreDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return GenreMapper.toDtoList(docs);
  };
}
