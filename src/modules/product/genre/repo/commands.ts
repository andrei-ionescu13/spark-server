import { Collection, ObjectId } from 'mongodb';
import { Result } from '../../../../Result';
import { DomainValidationError } from '../../../blog/article/status';
import { Genre } from '../genre';
import { GenreMapper } from '../genreMapper';
import { GenreDoc } from '../model';

export interface GenreCommandsRepoI {
  save: (genre: Genre) => Promise<void>;
  deleteGenre: (id: string) => Promise<void>;
  getGenre: (id: string) => Promise<Result<Genre | null, DomainValidationError>>;
}

export class GenreCommandsRepo implements GenreCommandsRepoI {
  constructor(private collection: Collection<GenreDoc>) {}

  save = async (genre: Genre): Promise<void> => {
    const persistence = GenreMapper.toPersistance(genre);

    await this.collection.updateOne({ _id: genre._id }, { $set: persistence }, { upsert: true });
  };

  getGenre = async (id: string): Promise<Result<Genre | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const genreOrError = GenreMapper.toDomain(doc);
    if (genreOrError.isErr()) {
      return Result.fail(new DomainValidationError(genreOrError.error.message));
    }

    const genre = genreOrError.value;
    return Result.ok(genre);
  };

  deleteGenre = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
