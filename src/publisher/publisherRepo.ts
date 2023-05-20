import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Publisher } from './model';

export interface PublisherRepoI {
  createPublisher: any;
  getPublisher: any;
  deletePublisher: any;
  deleteMultiplePublishers: any;
  listPublishers: any;
  updatePublisher: any;
  searchPublishers: any;
  getPublishersCount: any;
}

export class PublisherRepo implements PublisherRepoI {
  constructor(private publisherModel: Model<Publisher>) {}

  createPublisher = (props) => this.publisherModel.create(props);

  getPublisher = (id) => this.publisherModel.findOne({ _id: new ObjectId(id) }).exec();

  deletePublisher = (id) => this.publisherModel.deleteOne({ _id: id });

  deleteMultiplePublishers = (ids) => this.publisherModel.deleteMany({ _id: { $in: ids } });

  listPublishers = () => this.publisherModel.find();

  updatePublisher = (id, props) =>
    this.publisherModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchPublishers = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    return this.publisherModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(page * limit)
      .limit(limit)
      .exec();
  };

  getPublishersCount = (query) => {
    const { keyword = '' } = query;

    return this.publisherModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
}
