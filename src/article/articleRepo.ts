import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Article } from './model';

export interface ArticleRepoI {
  createArticle: any;
  getArticle: any;
  deleteArticle: any;
  deleteMultipleArticles: any;
  listArticles: any;
  updateArticle: (id: string, props: any) => Promise<Article | null>;
  searchArticles: any;
  getArticlesCount: any;
  getArticleByCategory: any;
  deleteArticleTag: any;
  getArticleByProps: any;
}

export class ArticleRepo implements ArticleRepoI {
  constructor(private articleModel: Model<Article>) {}

  createArticle = (props) => this.articleModel.create(props);

  getArticle = (id) =>
    this.articleModel
      .findOne({ _id: new ObjectId(id) })
      .populate('category tags')
      .lean();

  getArticleByProps = (props: Array<Record<string, any>>) =>
    this.articleModel.findOne({ $or: props }).lean();

  deleteArticle = (id) => this.articleModel.deleteOne({ _id: id });

  deleteMultipleArticles = (ids) => this.articleModel.deleteMany({ _id: { $in: ids } });

  listArticles = (ids) => this.articleModel.find({ _id: { $in: ids } });

  updateArticle = (id, props): Promise<Article | null> =>
    this.articleModel
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...props, updatedAt: Date.now() } },
        { new: true },
      )
      .populate('tags');

  deleteArticleTag = (tagId) =>
    this.articleModel.updateMany({ tags: tagId }, { $pull: { tags: tagId } });

  searchArticles = (query) => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      category,
      page = 0,
      limit = 10,
    } = query;

    return this.articleModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
        ...(status && {
          status,
        }),
        ...(category && {
          category,
        }),
      })
      .sort({
        [sortBy]: sortOrder,
      })
      .skip(page * limit)
      .limit(limit)
      .exec();
  };

  getArticlesCount = (query) => {
    const { keyword = '', status, category } = query;

    return this.articleModel
      .find({
        title: {
          $regex: keyword,
          $options: 'i',
        },
        ...(status && {
          status,
        }),
        ...(category && {
          category,
        }),
      })
      .count();
  };

  getArticleByCategory = (categoryId) => this.articleModel.findOne({ category: categoryId });

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
