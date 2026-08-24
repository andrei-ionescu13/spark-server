import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleTag } from '../articleTag';
import { ArticleTagDto, ArticleTagMapper } from '../articleTagMapper';
import { ArticleTagDoc } from '../model';

type SearchArticleCategoriesQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface ArticleTagQueryRepoI {
  searchArticleCategories: (query: SearchArticleCategoriesQuery) => Promise<{
    tags: ArticleTag[];
    count: number;
  }>;
  getArticleTag: (id: string) => Promise<ArticleTagDto | null>;
  getArticleTagByName: (name: string) => Promise<ArticleTagDto | null>;
  getArticleTagByPropsOr: (props: Array<Record<string, unknown>>) => Promise<ArticleTagDto | null>;
  getArticleTags: (ids: string[]) => Promise<ArticleTagDto[]>;
  listArticleTags: () => Promise<ArticleTagDto[]>;
}

export class ArticleTagQueryRepo implements ArticleTagQueryRepoI {
  constructor(private articleTagModel: Model<ArticleTagDoc>) {}

  searchArticleCategories = async (
    query: SearchArticleCategoriesQuery,
  ): Promise<{
    tags: ArticleTag[];
    count: number;
  }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;

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
          tags: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          count: [
            {
              $count: 'count',
            },
          ],
        },
      },
      {
        $project: {
          tags: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ]);

    return {
      tags: result.tags.map((entity) => ArticleTagMapper.toDto(entity)),
      count: result.count,
    };
  };

  getArticleTag = async (id: string): Promise<ArticleTagDto | null> => {
    const doc = await this.articleTagModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!doc) return null;

    return ArticleTagMapper.toDto(doc);
  };

  getArticleTagByName = async (name: string): Promise<ArticleTagDto | null> => {
    const doc = await this.articleTagModel.findOne({ name }).lean();
    if (!doc) return null;

    return ArticleTagMapper.toDto(doc);
  };

  deleteArticleTag = (id: string) => this.articleTagModel.deleteOne({ _id: id });

  getArticleTagByPropsOr = async (props: Array<Record<string, unknown>>) => {
    const articleTagEntity = await this.articleTagModel.findOne({ $or: props }).lean();
    if (!articleTagEntity) return null;

    return ArticleTagMapper.toDto(articleTagEntity);
  };

  getArticleTags = async (ids: string[]): Promise<ArticleTagDto[]> => {
    const docs = await this.articleTagModel.find({ _id: { $in: ids } });
    return ArticleTagMapper.toDtoList(docs);
  };

  listArticleTags = async (): Promise<ArticleTagDto[]> => {
    const docs = await this.articleTagModel.find({});
    return ArticleTagMapper.toDtoList(docs);
  };
}
