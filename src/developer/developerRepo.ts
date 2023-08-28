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
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

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
      .skip(page * limit)
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
  // deleteMultipleArticles = (ids) => this.articleModel.deleteMany({ _id: { $in: ids } });

  // listArticles = (ids) => this.articleModel.find({ _id: { $in: ids } });

  // updateArticle = (id, props): Promise<Article | null> =>
  //   this.articleModel.findOneAndUpdate(
  //     { _id: new ObjectId(id) },
  //     { $set: { ...props, updatedAt: Date.now() } },
  //     { new: true },
  //   );

  // searchArticles = (query) => {
  //   const {
  //     keyword = '',
  //     sortBy = 'createdAt',
  //     sortOrder = 'desc',
  //     status,
  //     category,
  //     page = 0,
  //     limit = 10,
  //   } = query;

  //   return this.articleModel
  //     .find({
  //       title: {
  //         $regex: keyword,
  //         $options: 'i',
  //       },
  //       ...(status && {
  //         status,
  //       }),
  //       ...(category && {
  //         category,
  //       }),
  //     })
  //     .sort({
  //       [sortBy]: sortOrder,
  //     })
  //     .skip(page * limit)
  //     .limit(limit)
  //     .exec();
  // };

  // getArticlesCount = (query) => {
  //   const { status, category } = query;

  //   return this.articleModel
  //     .find({
  //       ...(status && {
  //         status,
  //       }),
  //       ...(category && {
  //         category,
  //       }),
  //     })
  //     .count();
  // };

  // duplicateArticle = async (id) => {
  //   const article = await this.getArticle(id);

  //   //TODO: change this
  //   if (!article) {
  //     return;
  //   }
  //   let { _id, ...articleProps } = article;

  //   articleProps.status = 'draft';
  //   articleProps.createdAt = new Date();
  //   articleProps.cover = await uploader.upload(articleProps.cover.url);

  //   const newArticle = await this.createArticle(articleProps);
  //   return newArticle;
  // };
}
