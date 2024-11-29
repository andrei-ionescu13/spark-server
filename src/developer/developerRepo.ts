import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Developer } from './model';

export interface DeveloperRepoI {
  createDeveloper: any;
  deleteDeveloper: any;
  deleteMultipleArticles: any;
  updateDeveloper: (id: string, props: any) => Promise<Developer | null>;
  searchDevelopers: any;
  listDevelopers: any;

  getDevelopersCount: any;
  getDeveloper: any;
  getDeveloperByName: any;
  getDeveloperByPropsOr: any;
  getDevelopers: any;
  // getArticlesCount: any;
}

export class DeveloperRepo implements DeveloperRepoI {
  constructor(private developerModel: Model<Developer>) {}
  createDeveloper = (props) => this.developerModel.create(props);
  deleteMultipleArticles: any;
  updateDeveloper = (id, props): Promise<Developer | null> =>
    this.developerModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );
  searchDevelopers = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

    return this.developerModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
  };

  getDevelopersCount = (query) => {
    const { keyword = '' } = query;

    return this.developerModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
  // createArticle = (props) => this.articleModel.create(props);

  getDeveloper = (id) => this.developerModel.findOne({ _id: new ObjectId(id) }).lean();

  getDeveloperByName = (name) => this.developerModel.findOne({ name }).lean();

  deleteDeveloper = (id) => this.developerModel.deleteOne({ _id: id });

  listDevelopers = () => this.developerModel.find({});

  getDeveloperByPropsOr = (props: Array<Record<string, any>>) =>
    this.developerModel.findOne({ $or: props }).lean();

  getDevelopers = (ids) => this.developerModel.find({ _id: { $in: ids } });
}
