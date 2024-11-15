import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { OperatingSystem } from './model';

export interface OperatingSystemRepoI {
  createOperatingSystem: any;
  getOperatingSystem: any;
  deleteOperatingSystem: any;
  deleteMultipleOperatingSystems: any;
  listOperatingSystems: any;
  updateOperatingSystem: any;
  searchOperatingSystems: any;
  getOperatingSystemsCount: any;
  getOperatingSystems: any;
}

export class OperatingSystemRepo implements OperatingSystemRepoI {
  constructor(private operatingSystemModel: Model<OperatingSystem>) {}

  createOperatingSystem = (props) => this.operatingSystemModel.create(props);

  getOperatingSystem = (id) => this.operatingSystemModel.findOne({ _id: new ObjectId(id) }).exec();

  getOperatingSystems = (ids) => this.operatingSystemModel.find({ _id: { $in: ids } });

  deleteOperatingSystem = (id) => this.operatingSystemModel.deleteOne({ _id: id });

  deleteMultipleOperatingSystems = (ids) =>
    this.operatingSystemModel.deleteMany({ _id: { $in: ids } });

  listOperatingSystems = () => this.operatingSystemModel.find({});

  updateOperatingSystem = (id, props) =>
    this.operatingSystemModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: props },
      { new: true },
    );

  searchOperatingSystems = async (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'asc', page = 0, limit = 10 } = query;

    const result = await this.operatingSystemModel.aggregate([
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
          operatingSystems: [
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
          operatingSystems: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return result[0];
  };

  getOperatingSystemsCount = (query) => {
    const { keyword = '' } = query;

    return this.operatingSystemModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
}
