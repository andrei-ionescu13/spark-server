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

  searchOperatingSystems = (query) => {
    console.log('db', query);
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'asc', page, limit } = query;
    return this.operatingSystemModel
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
