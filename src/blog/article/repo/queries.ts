import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleDto, ArticleMapper } from '../articleMapper';
import { ArticleDoc } from '../model';

type SearchArticlesQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  category?: string;
  page?: number;
  limit: number;
};

export interface ArticleQueryRepoI {
  getArticleByProps: (props: Array<Record<string, unknown>>) => Promise<ArticleDto | null>;
  getArticle: (id: string) => Promise<ArticleDto | null>;
  listArticles: (ids: string[]) => Promise<ArticleDto[]>;
  searchArticles: (
    query: SearchArticlesQuery,
  ) => Promise<{ articles: ArticleDto[]; count: number }>;
  getArticleByCategory: (categoryId: string) => Promise<ArticleDto | null>;
}

export class ArticleQueryRepo implements ArticleQueryRepoI {
  constructor(private articleModel: Model<ArticleDoc>) {}

  getArticleByProps = async (props: Array<Record<string, unknown>>): Promise<ArticleDto | null> => {
    const articleEntity = await this.articleModel.findOne({ $or: props }).lean();
    if (!articleEntity) null;

    return ArticleMapper.toDto(articleEntity);
  };

  getArticle = async (id: string): Promise<ArticleDto | null> => {
    const articleEntity = await this.articleModel
      .findOne({ _id: new ObjectId(id) })
      .populate('category tags')
      .lean();
    if (!articleEntity) return null;

    return ArticleMapper.toDto(articleEntity);
  };

  listArticles = async (ids: string[]): Promise<ArticleDto[]> => {
    const articleEntities = await this.articleModel.find({ _id: { $in: ids } });

    return ArticleMapper.toDtoList(articleEntities);
  };

  searchArticles = async (
    query: SearchArticlesQuery,
  ): Promise<{ articles: ArticleDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      category,
      page = 1,
      limit = 10,
    } = query;

    const [result] = await this.articleModel.aggregate([
      {
        $match: {
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
        },
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      {
        $facet: {
          articles: [
            { $skip: (page - 1) * limit },
            { $limit: limit },
            {
              $lookup: {
                from: 'articlecategories',
                localField: 'category',
                foreignField: '_id',
                as: 'category',
              },
            },
            {
              $addFields: {
                category: { $arrayElemAt: ['$category', 0] },
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
          count: { $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0] },
        },
      },
    ]);

    return {
      articles: ArticleMapper.toDtoList(result.articles),
      count: result.count,
    };
  };

  getArticleByCategory = async (categoryId: string): Promise<ArticleDto | null> => {
    const articleEntity = await this.articleModel.findOne({ category: categoryId });
    if (!articleEntity) return null;

    return ArticleMapper.toDto(articleEntity);
  };
}
