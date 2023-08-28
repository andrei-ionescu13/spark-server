import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Feature } from './model';

export interface FeatureRepoI {
  createFeature: any;
  deleteFeature: any;
  deleteMultipleArticles: any;
  updateArticle: (id: string, props: any) => Promise<Feature | null>;
  searchArticleCategories: any;
  listFeatures: any;

  getArticleCategoriesCount: any;
  getFeature: any;
  getFeatureByName: any;
  getFeatureByPropsOr: any;
  getFeatures: any;
  // getArticlesCount: any;
}

export class FeatureRepo implements FeatureRepoI {
  constructor(private featureModel: Model<Feature>) {}
  createFeature = (props) => this.featureModel.create(props);
  deleteMultipleArticles: any;
  updateArticle = (id, props): Promise<Feature | null> =>
    this.featureModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );
  searchArticleCategories = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    return this.featureModel
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

  getArticleCategoriesCount = (query) => {
    const { keyword = '' } = query;

    return this.featureModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
  // createArticle = (props) => this.articleModel.create(props);

  getFeature = (id) => this.featureModel.findOne({ _id: new ObjectId(id) }).lean();

  getFeatureByName = (name) => this.featureModel.findOne({ name }).lean();

  deleteFeature = (id) => this.featureModel.deleteOne({ _id: id });

  listFeatures = () => this.featureModel.find({});

  getFeatureByPropsOr = (props: Array<Record<string, any>>) =>
    this.featureModel.findOne({ $or: props }).lean();

  getFeatures = (ids) => this.featureModel.find({ _id: { $in: ids } });
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
