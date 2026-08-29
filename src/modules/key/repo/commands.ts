import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { Key } from '../key';
import { KeyMapper } from '../keyMapper';
import { KeyDoc } from '../model';
import { Collection } from 'mongodb';

export interface KeyCommandsRepoI {
  save: (key: Key) => Promise<void>;
  deleteKey: (id: string) => Promise<void>;
  getKey: (id: string) => Promise<Result<Key | null, DomainValidationError>>;
}

export class KeyCommandsRepo implements KeyCommandsRepoI {
  constructor(private collection: Collection<KeyDoc>) {}

  save = async (key: Key): Promise<void> => {
    const persistence = KeyMapper.toPersistance(key);
    await this.collection.updateOne({ _id: key._id }, { $set: persistence }, { upsert: true });
  };

  deleteKey = async (id: string): Promise<void> => {
    await this.collection.deleteOne({ _id: id });
  };

  getKey = async (id: string): Promise<Result<Key | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const keyOrError = KeyMapper.toDomain(doc);
    if (keyOrError.isErr()) {
      return Result.fail(new DomainValidationError(keyOrError.error.message));
    }

    const key = keyOrError.value;
    return Result.ok(key);
  };
}
