import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../Result';
import { DomainValidationError } from '../../blog/article/status';
import { Collection } from '../collection';
import { CollectionMapper } from '../collectionMapper';
import { CollectionDoc } from '../model';

export interface CollectionCommandsRepoI {
  save: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  getCollection: (id: string) => Promise<Result<Collection | null, DomainValidationError>>;
}

export class CollectionCommandsRepo implements CollectionCommandsRepoI {
  constructor(private collectionModel: Model<CollectionDoc>) {}

  save = async (collection: Collection): Promise<void> => {
    const persistence = CollectionMapper.toPersistance(collection);

    await this.collectionModel.updateOne(
      { _id: collection._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getCollection = async (id: string): Promise<Result<Collection | null, DomainValidationError>> => {
    const doc = await this.collectionModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return Result.ok(null);

    const collectionOrError = CollectionMapper.toDomain(doc);
    if (collectionOrError.isErr()) {
      return Result.fail(new DomainValidationError(collectionOrError.error.message));
    }

    const collection = collectionOrError.value;
    return Result.ok(collection);
  };

  deleteCollection = async (id: string) => {
    await this.collectionModel.deleteOne({ _id: id });
  };
}
