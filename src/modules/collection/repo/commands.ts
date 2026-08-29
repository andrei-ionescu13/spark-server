import { Collection as CollectionMongo } from 'mongodb';
import { Result } from '../../../Result';
import { DomainValidationError } from '../../blog/article/status';
import { CollectionMapper } from '../collectionMapper';
import { CollectionDoc } from '../model';
import { Collection } from '../collection';

export interface CollectionCommandsRepoI {
  save: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  getCollection: (id: string) => Promise<Result<Collection | null, DomainValidationError>>;
  getCollectionsByProduct: (
    productId: string,
  ) => Promise<Result<Collection[], DomainValidationError>>;
}

export class CollectionCommandsRepo implements CollectionCommandsRepoI {
  constructor(private collection: CollectionMongo<CollectionDoc>) {}

  save = async (collection: Collection): Promise<void> => {
    const persistence = CollectionMapper.toPersistance(collection);

    await this.collection.updateOne(
      { _id: collection._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getCollection = async (id: string): Promise<Result<Collection | null, DomainValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const collectionOrError = CollectionMapper.toDomain(doc);
    if (collectionOrError.isErr()) {
      return Result.fail(new DomainValidationError(collectionOrError.error.message));
    }

    const collection = collectionOrError.value;
    return Result.ok(collection);
  };

  getCollectionsByProduct = async (
    productId: string,
  ): Promise<Result<Collection[], DomainValidationError>> => {
    const docs = await this.collection.find({ products: productId }).toArray();
    const collectionOrError = CollectionMapper.toDomainList(docs);
    if (collectionOrError.isErr()) {
      return Result.fail(new DomainValidationError(collectionOrError.error.message));
    }

    const collections = collectionOrError.value;
    return Result.ok(collections);
  };

  deleteCollection = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
