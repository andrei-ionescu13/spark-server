import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Platform } from './model';

export interface PlatformRepoI {
  createPlatform: any;
  getPlatform: any;
  deletePlatform: any;
  deleteMultiplePlatforms: any;
  listPlatforms: any;
  updatePlatform: any;
  searchPlatforms: any;
  getPlatformsCount: any;
}

export class PlatformRepo implements PlatformRepoI {
  constructor(private platformModel: Model<Platform>) {}

  createPlatform = (props) => this.platformModel.create(props);

  getPlatform = (id) => this.platformModel.findOne({ _id: new ObjectId(id) }).exec();

  deletePlatform = (id) => this.platformModel.deleteOne({ _id: id });

  deleteMultiplePlatforms = (ids) => this.platformModel.deleteMany({ _id: { $in: ids } });

  listPlatforms = () => this.platformModel.find();

  updatePlatform = (id, props) =>
    this.platformModel.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: props }, { new: true });

  searchPlatforms = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    return this.platformModel
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

  getPlatformsCount = (query) => {
    const { keyword = '' } = query;

    return this.platformModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };

  // duplicatePlatform = async (id) => {
  //   const article = await this.getPlatform(id);
  //   let { _id, ...articleProps } = article._doc;
  //   articleProps.status = 'draft';
  //   const newPlatform = await this.createPlatform(articleProps)
  //   return newPlatform
  // }
}
