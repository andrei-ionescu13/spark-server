import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleTag } from './model';

export interface ArticleTagRepoI {
  createArticleTag: any;
  deleteArticleTag: any;
  deleteMultipleArticles: any;
  updateArticle: (id: string, props: any) => Promise<ArticleTag | null>;
  searchArticleCategories: any;
  listArticleTags: any;

  getArticleCategoriesCount: any;
  getArticleTag: any;
  getArticleTagByName: any;
  getArticleTagByPropsOr: any;
  getArticleTags: any;
  // getArticlesCount: any;
}

export class ArticleTagRepo implements ArticleTagRepoI {
  constructor(private articleTagModel: Model<ArticleTag>) {}
  createArticleTag = (props) => this.articleTagModel.create(props);
  deleteMultipleArticles: any;
  updateArticle = (id, props): Promise<ArticleTag | null> =>
    this.articleTagModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );
  searchArticleCategories = async (query) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    const result = await this.articleTagModel.aggregate([
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
          tags: [
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
          tags: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return result[0];
  };

  getArticleCategoriesCount = (query) => {
    const { keyword = '' } = query;

    return this.articleTagModel
      .find({
        name: {
          $regex: keyword,
          $options: 'i',
        },
      })
      .count();
  };
  // createArticle = (props) => this.articleModel.create(props);

  getArticleTag = (id) => this.articleTagModel.findOne({ _id: new ObjectId(id) }).lean();

  getArticleTagByName = (name) => this.articleTagModel.findOne({ name }).lean();

  deleteArticleTag = (id) => this.articleTagModel.deleteOne({ _id: id });

  listArticleTags = () => this.articleTagModel.find({});

  getArticleTagByPropsOr = (props: Array<Record<string, any>>) =>
    this.articleTagModel.findOne({ $or: props }).lean();

  getArticleTags = (ids) => this.articleTagModel.find({ _id: { $in: ids } });
}
