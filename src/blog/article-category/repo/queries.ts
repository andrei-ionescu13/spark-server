import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { ArticleCategoryDto, ArticleCategoryMapper } from '../articleCategoryMapper';
import { ArticleCategoryDoc } from '../model';

type SearchArticleCategoriesQuery = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface ArticleCategoryQueryRepoI {
  searchArticleCategories: (query: SearchArticleCategoriesQuery) => Promise<{
    categories: ArticleCategoryDto[];
    count: number;
  }>;
  listArticleCategories: () => Promise<ArticleCategoryDto[]>;
  getArticleCategory: (id: string) => Promise<ArticleCategoryDto | null>;
  getArticleCategoryByName: (name: string) => Promise<ArticleCategoryDto | null>;
  getArticleCategoryByPropsOr: (
    props: Array<Record<string, any>>,
  ) => Promise<ArticleCategoryDto | null>;
}

export class ArticleCategoryQueryRepo implements ArticleCategoryQueryRepoI {
  constructor(private articleCategoryModel: Model<ArticleCategoryDoc>) {}

  searchArticleCategories = async (query: SearchArticleCategoriesQuery) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 0, limit = 10 } = query;

    const [result] = await this.articleCategoryModel.aggregate([
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
          categories: [
            { $skip: page },
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
          categories: 1,
          count: { $ifNull: ['$count', 0] },
        },
      },
    ]);

    return {
      categories: ArticleCategoryMapper.toDtoList(result.categories),
      count: result.count,
    };
  };

  getArticleCategoryByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<ArticleCategoryDto | null> => {
    const entity = await this.articleCategoryModel.findOne({ $or: props }).lean();
    if (!entity) return null;

    return ArticleCategoryMapper.toDto(entity);
  };

  getArticleCategory = async (id: string) => {
    const entity = await this.articleCategoryModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!entity) return null;

    return ArticleCategoryMapper.toDto(entity);
  };

  listArticleCategories = async () => {
    const entities = await this.articleCategoryModel.find({});

    return ArticleCategoryMapper.toDtoList(entities);
  };

  getArticleCategoryByName = async (name: string) => {
    const doc = await this.articleCategoryModel.findOne({ name }).lean();
    if (!doc) return null;

    return ArticleCategoryMapper.toDto(doc);
  };
}
