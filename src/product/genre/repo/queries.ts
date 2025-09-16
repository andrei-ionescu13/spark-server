import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { GenreDto, GenreMapper } from '../genreMapper';
import { GenreDoc } from '../model';

type SearchGenresQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface GenreQueriesRepoI {
  searchGenres: (query: SearchGenresQuery) => Promise<{ genres: GenreDto[]; count: number }>;
  listGenres: () => Promise<GenreDto[]>;
  getGenre: (id: string) => Promise<GenreDto | null>;
  getGenreByName: (name: string) => Promise<GenreDto | null>;
  getGenreByPropsOr: (props: Array<Record<string, unknown>>) => Promise<GenreDto | null>;
  getGenres: (ids: string[]) => Promise<GenreDto[]>;
}

export class GenreQueriesRepo implements GenreQueriesRepoI {
  constructor(private genreModel: Model<GenreDoc>) {}

  searchGenres = async (
    query: SearchGenresQuery,
  ): Promise<{ genres: GenreDto[]; count: number }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    const [result] = await this.genreModel.aggregate([
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
    ]);

    return {
      genres: GenreMapper.toDtoList(result.genres),
      count: result.count,
    };
  };

  getGenre = async (id: string): Promise<GenreDto | null> => {
    const doc = await this.genreModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return GenreMapper.toDto(doc);
  };

  getGenreByName = async (name: string): Promise<GenreDto | null> => {
    const doc = this.genreModel.findOne({ name }).lean();
    if (!doc) return null;

    return GenreMapper.toDto(doc);
  };

  listGenres = async (): Promise<GenreDto[]> => {
    const docs = await this.genreModel.find({});
    return GenreMapper.toDtoList(docs);
  };

  getGenreByPropsOr = async (props: Array<Record<string, any>>): Promise<GenreDto | null> => {
    const doc = this.genreModel.findOne({ $or: props }).lean();
    if (!doc) return null;

    return GenreMapper.toDto(doc);
  };

  getGenres = async (ids: string[]): Promise<GenreDto[]> => {
    const docs = await this.genreModel.find({ _id: { $in: ids } });
    return GenreMapper.toDtoList(docs);
  };
}
