import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleCategory } from './model';

export interface ArticleCategoryRepoI {
  createArticleCategory: any;
  deleteArticleCategory: any;
  deleteMultipleArticles: any;
  updateArticle: (id: string, props: any) => Promise<ArticleCategory | null>;
  searchArticleCategories: any;
  listArticleCategories: any;

  getArticleCategoriesCount: any;
  getArticleCategory: any;
  getArticleCategoryByName: any;
  getArticleCategoryByPropsOr: any;
  // getArticlesCount: any;
}

export class ArticleCategoryRepo implements ArticleCategoryRepoI {
  constructor(private articleCategoryModel: Model<ArticleCategory>) {}
  createArticleCategory = (props) => this.articleCategoryModel.create(props);
  deleteMultipleArticles: any;
  updateArticle = (id, props): Promise<ArticleCategory | null> =>
    this.articleCategoryModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );
  searchArticleCategories = (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    return this.articleCategoryModel
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

  getArticleCategoryByPropsOr = (props: Array<Record<string, any>>) =>
    this.articleCategoryModel.findOne({ $or: props }).lean();

  getArticleCategoriesCount = (query) => {
    const { keyword = '' } = query;

    return this.articleCategoryModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
  // createArticle = (props) => this.articleModel.create(props);

  getArticleCategory = (id) => this.articleCategoryModel.findOne({ _id: new ObjectId(id) }).lean();

  getArticleCategoryByName = (name) => this.articleCategoryModel.findOne({ name }).lean();

  deleteArticleCategory = (id) => this.articleCategoryModel.deleteOne({ _id: id });

  listArticleCategories = () => this.articleCategoryModel.find({});

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
