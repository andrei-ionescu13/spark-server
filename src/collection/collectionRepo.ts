import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { CollectionDoc } from './model';

export interface CollectionRepoI {
  createCollection: any;
  getCollection: any;
  deleteCollection: any;
  deleteMultipleCollections: any;
  listCollections: any;
  updateCollection: any;
  duplicateCollection: any;
  removeProductFromCollections: any;
}

export class CollectionRepo implements CollectionRepoI {
  constructor(private collectionModel: Model<CollectionDoc>) {}

  createCollection = (props) => this.collectionModel.create(props);

  getCollection = (id) =>
    this.collectionModel
      .findOne({ _id: new ObjectId(id) })
      .populate('products')
      .exec();

  deleteCollection = (id) => this.collectionModel.deleteOne({ _id: id });

  deleteMultipleCollections = (ids) => this.collectionModel.deleteMany({ _id: { $in: ids } });

  listCollections = (ids) => this.collectionModel.find({ _id: { $in: ids } });

  updateCollection = (id, props) =>
    this.collectionModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );

  duplicateCollection = async (id) => {
    const collection = await this.getCollection(id);
    //@ts-ignore
    let { _id, ...collectionProps } = collection._doc;

    collectionProps.status = 'draft';
    collectionProps.createdAt = Date.now();

    const newCollection = await this.createCollection(collectionProps);
    return newCollection;
  };

  removeProductFromCollections = (productId) =>
    this.collectionModel
      .updateMany(
        { products: productId },
        {
          $pull: {
            products: productId,
          },
        },
        {
          new: true,
        },
      )
      .exec();
}
