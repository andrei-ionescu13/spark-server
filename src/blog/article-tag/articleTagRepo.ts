import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleTag } from './articleTag';
import { ArticleTagMapper } from './articleTagMapper';
import { ArticleTagEntity } from './model';

type SearchArticleCategoriesQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface ArticleTagRepoI {
  createArticleTag: (props: Record<string, unknown>) => Promise<ArticleTag>;
  deleteArticleTag: (id: string) => Promise<void>;
  deleteMultipleArticles: any;
  updateArticleTag: (id: string, props: any) => Promise<ArticleTag | null>;
  searchArticleCategories: (query: SearchArticleCategoriesQuery) => Promise<{
    tags: ArticleTag[];
    count: number;
  }>;
  listArticleTags: () => Promise<ArticleTag[]>;
  getArticleTag: any;
  getArticleTagByName: any;
  getArticleTagByPropsOr: (props: Array<Record<string, any>>) => Promise<ArticleTag | null>;
  getArticleTags: any;
}

export class ArticleTagRepo implements ArticleTagRepoI {
  constructor(private articleTagModel: Model<ArticleTagEntity>) {}

  createArticleTag = async (props: Record<string, unknown>): Promise<ArticleTag> => {
    const entity = await this.articleTagModel.create(props);
    return ArticleTagMapper.toDomain(entity);
  };

  deleteMultipleArticles: any;

  updateArticleTag = async (id: string, props: any) => {
    const entity = await this.articleTagModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );

    if (!entity) return null;

    return ArticleTagMapper.toDomain(entity);
  };

  searchArticleCategories = async (
    query: SearchArticleCategoriesQuery,
  ): Promise<{
    tags: ArticleTag[];
    count: number;
  }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    const [result] = await this.articleTagModel.aggregate([
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

    return {
      tags: result.tags.map((entity) => ArticleTagMapper.toDomain(entity)),
      count: result.count,
    };
  };

  getArticleTag = (id) => this.articleTagModel.findOne({ _id: new ObjectId(id) }).lean();

  getArticleTagByName = (name) => this.articleTagModel.findOne({ name }).lean();

  deleteArticleTag = async (id: string) => {
    await this.articleTagModel.deleteOne({ _id: id });
  };

  listArticleTags = async () => {
    const articleTagEntities = await this.articleTagModel.find({});

    return articleTagEntities.map((entity) => ArticleTagMapper.toDomain(entity));
  };

  getArticleTagByPropsOr = async (props: Array<Record<string, any>>) => {
    const articleTagEntity = await this.articleTagModel.findOne({ $or: props }).lean();

    if (!articleTagEntity) return null;

    return ArticleTagMapper.toDomain(articleTagEntity);
  };

  getArticleTags = (ids) => this.articleTagModel.find({ _id: { $in: ids } });
}
