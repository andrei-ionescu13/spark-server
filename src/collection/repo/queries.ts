import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CollectionDto, CollectionMapper } from '../collectionMapper';
import { CollectionDoc } from '../model';

export interface CollectionQueriesRepoI {
  getCollection: (id: string) => Promise<CollectionDto | null>;
}

export class CollectionQueriesRepo implements CollectionQueriesRepoI {
  constructor(private collectionModel: Model<CollectionDoc>) {}

  getCollection = async (id: string): Promise<CollectionDto | null> => {
    const doc = await this.collectionModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products')
      .lean();
    if (!doc) return null;

    return CollectionMapper.toDto(doc);
  };
}
