import { Collection as CollectionMongo } from 'mongodb';
import { DomainValidationError } from '../../blog/article/domain/status';
import { CollectionMapper } from '../collectionMapper';
import { CollectionDoc } from '../model';
import { Collection } from '../domain/collection';

export interface CollectionCommandsRepoI {
  save: (collection: Collection) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  getCollection: (id: string) => Promise<Collection | null>;
  getCollectionsByProduct: (productId: string) => Promise<Collection[]>;
}

export class CollectionCommandsRepo implements CollectionCommandsRepoI {
  constructor(private collection: CollectionMongo<CollectionDoc>) {}

  save = async (collection: Collection): Promise<void> => {
    const persistence = CollectionMapper.toPersistance(collection);
    console.log(persistence);
    await this.collection.updateOne(
      { _id: collection._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getCollection = async (id: string): Promise<Collection | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const collection = CollectionMapper.toDomain(doc);
    return collection;
  };

  getCollectionsByProduct = async (productId: string): Promise<Collection[]> => {
    const docs = await this.collection.find({ products: productId }).toArray();
    const collections = CollectionMapper.toDomainList(docs);
    return collections;
  };

  deleteCollection = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };
}
