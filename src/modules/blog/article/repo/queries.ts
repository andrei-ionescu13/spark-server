import { Collection, Document, ObjectId } from 'mongodb';
import { ArticlePopulatedDto, ArticleMapper, ArticleDto } from '../articleMapper';
import { ArticleDoc, ArticlePopulatedDoc } from '../model';
import { match } from 'node:assert';

type SearchArticlesQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  status?: string;
  category?: string;
  page?: number;
  limit: number;
};

export interface ArticleQueriesRepoI {
  getArticleByProps: (props: Array<Record<string, unknown>>) => Promise<ArticleDto | null>;
  getArticle: (id: string) => Promise<ArticlePopulatedDto | null>;
  searchArticles: (
    query: SearchArticlesQueries,
  ) => Promise<{ articles: ArticlePopulatedDto[]; count: number }>;
  getArticleByCategory: (categoryId: string) => Promise<ArticleDto | null>;
}

export class ArticleQueriesRepo implements ArticleQueriesRepoI {
  constructor(private collection: Collection<ArticleDoc>) {}

  getArticleByProps = async (props: Array<Record<string, unknown>>): Promise<ArticleDto | null> => {
    const doc = await this.collection.findOne({ $or: props });
    if (!doc) return null;

    return ArticleMapper.toDto(doc);
  };

  getArticle = async (id: string): Promise<ArticlePopulatedDto | null> => {
    const doc = await this.collection
      .aggregate<ArticlePopulatedDoc>([
        {
          $match: {
            _id: id,
          },
        },
        {
          $lookup: {
            from: 'article_categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {
          $unwind: '$category',
        },
        {
          $lookup: {
            from: 'article_tags',
            localField: 'tags',
            foreignField: '_id',
            as: 'tags',
          },
        },
      ])
      .next();

    if (!doc) return null;

    return ArticleMapper.toPopulatedDto(doc);
  };

  searchArticles = async (
    query: SearchArticlesQueries,
  ): Promise<{ articles: ArticlePopulatedDto[]; count: number }> => {
    const {
      keyword = '',
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status,
      category,
      page = 1,
      limit = 10,
    } = query;

    const pipeline = [
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
                from: 'article_categories',
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
    ];
    const [result] = await this.collection.aggregate(pipeline).toArray();
    return {
      articles: ArticleMapper.toPopulatedDtoList(result.articles),
      count: result.count,
    };
  };

  getArticleByCategory = async (categoryId: string): Promise<ArticleDto | null> => {
    const doc = await this.collection.findOne({ category: categoryId });
    if (!doc) return null;

    return ArticleMapper.toDto(doc);
  };
}
