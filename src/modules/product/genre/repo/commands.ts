import { Collection, ObjectId } from 'mongodb';
import { Result } from '../../../../result';
import { DomainValidationError } from '../../../blog/article/domain/status';
import { Genre } from '../domain/genre';
import { GenreMapper } from '../genreMapper';
import { GenreDoc } from '../model';

export interface GenreCommandsRepoI {
  save: (genre: Genre) => Promise<void>;
  deleteGenre: (id: string) => Promise<void>;
  getGenre: (id: string) => Promise<Genre | null>;
}

export class GenreCommandsRepo implements GenreCommandsRepoI {
  constructor(private collection: Collection<GenreDoc>) {}

  save = async (genre: Genre): Promise<void> => {
    const persistence = GenreMapper.toPersistance(genre);

    await this.collection.updateOne({ _id: genre._id }, { $set: persistence }, { upsert: true });
  };

  getGenre = async (id: string): Promise<Genre | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const genre = GenreMapper.toDomain(doc);
    return genre;
  };

  deleteGenre = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
