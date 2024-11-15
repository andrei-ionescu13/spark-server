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

  searchPublishers = async (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    const result = await this.publisherModel.aggregate([
      {
        $match: {
          name: {
            $regex: keyword,
            $options: 'i',
          },
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          publishers: [
            { $skip: page },
            { $limit: limit },
            {
              $lookup: {
                from: 'articletags',
                localField: 'tag',
                foreignField: '_id',
                as: 'tag',
              },
            },
            {
              $addFields: {
                tag: { $arrayElemAt: ['$tag', 0] },
              },
            },
          ],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $addFields: {
          count: {
            $arrayElemAt: ['$count', 0],
          },
        },
      },
      {
        $addFields: {
          count: '$count.count',
        },
      },
      {
        $project: {
          publishers: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return result[0];
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
