import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../results';
import { Key } from '../domain/key';
import { KeyMapper } from '../keyMapper';
import { KeyDoc } from '../model';
import { Collection } from 'mongodb';

export interface KeyCommandsRepoI {
  save: (key: Key) => Promise<void>;
  deleteKey: (id: string) => Promise<void>;
  getKey: (id: string) => Promise<Key | null>;
  getKeyByValue: (value: string) => Promise<Key | null>;
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

  getKey = async (id: string): Promise<Key | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const key = KeyMapper.toDomain(doc);
    return key;
  };

  getKeyByValue = async (value: string): Promise<Key | null> => {
    const doc = await this.collection.findOne({ value });
    if (!doc) return null;

    return KeyMapper.toDomain(doc);
  };
}
