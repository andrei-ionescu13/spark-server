import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Collection } from './model';

export interface CollectionRepoI {
  createCollection: any;
  getCollection: any;
  deleteCollection: any;
  deleteMultipleCollections: any;
  listCollections: any;
  updateCollection: any;
  searchCollections: any;
  getCollectionsCount: any;
  duplicateCollection: any;
  removeProductFromCollections: any;
}

const buildIntervalQuery = (status) => {
  if (status === 'expired') {
    return {
      endDate: {
        $exists: true,
        $ne: null,
        $lte: Date.now(),
      },
    };
  }

  if (status === 'active') {
    return {
      startDate: {
        $lte: Date.now(),
      },
    };
  }

  if (status === 'scheduled') {
    return {
      $or: [
        {
          $and: [
            {
              endDate: {
                $gt: Date.now(),
                $exists: true,
                $ne: null,
              },
            },
            {
              startDate: {
                $gt: Date.now(),
              },
            },
          ],
        },
        {
          $and: [
            {
              endDate: null,
            },
            {
              startDate: {
                $gt: Date.now(),
              },
            },
          ],
        },
      ],
    };
  }

  return {};
};

export class CollectionRepo implements CollectionRepoI {
  constructor(private collectionModel: Model<Collection>) {}

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

  searchCollections = (query) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
      status,
    } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.collectionModel
      .find({
        $and: [
          {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          },
          intervalQuery,
        ],
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  };

  getCollectionsCount = (query) => {
    const { keyword = '', status } = query;
    const intervalQuery = buildIntervalQuery(status);

    return this.collectionModel
      .find({
        $and: [
          {
            title: {
              $regex: keyword,
              $options: 'i',
            },
          },
          intervalQuery,
        ],
      })
      .count();
  };

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
