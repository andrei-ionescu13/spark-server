import { Collection, ObjectId } from 'mongodb';
import { ArticleCategoryDto, ArticleCategoryMapper } from '../articleCategoryMapper';
import { ArticleCategoryDoc } from '../model';

type SearchArticleCategoriesQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface ArticleCategoryQueriesRepoI {
  searchArticleCategories: (query: SearchArticleCategoriesQueries) => Promise<{
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

export class ArticleCategoryQueriesRepo implements ArticleCategoryQueriesRepoI {
  constructor(private collection: Collection<ArticleCategoryDoc>) {}

  searchArticleCategories = async (query: SearchArticleCategoriesQueries) => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;
    const pipeline = [
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
        $project: {
          categories: 1,
          count: {
            $ifNull: [{ $arrayElemAt: ['$count.count', 0] }, 0],
          },
        },
      },
    ];

    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      categories: ArticleCategoryMapper.toDtoList(result.categories),
      count: result.count,
    };
  };

  getArticleCategoryByPropsOr = async (
    props: Array<Record<string, any>>,
  ): Promise<ArticleCategoryDto | null> => {
    const entity = await this.collection.findOne({ $or: props });
    if (!entity) return null;

    return ArticleCategoryMapper.toDto(entity);
  };

  getArticleCategory = async (id: string) => {
    const entity = await this.collection.findOne({ _id: id });
    if (!entity) return null;

    return ArticleCategoryMapper.toDto(entity);
  };

  listArticleCategories = async () => {
    const docs = await this.collection.find({}).toArray();
    return ArticleCategoryMapper.toDtoList(docs);
  };

  getArticleCategoryByName = async (name: string) => {
    const doc = await this.collection.findOne({ name });
    if (!doc) return null;

    return ArticleCategoryMapper.toDto(doc);
  };
}
