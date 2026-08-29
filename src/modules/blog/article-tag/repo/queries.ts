import { Collection, Document, ObjectId } from 'mongodb';
import { ArticleTag } from '../articleTag';
import { ArticleTagDto, ArticleTagMapper } from '../articleTagMapper';
import { ArticleTagDoc } from '../model';

type SearchArticleCategoriesQueries = {
  keyword?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit: number;
};

export interface ArticleTagQueriesRepoI {
  searchArticleCategories: (query: SearchArticleCategoriesQueries) => Promise<{
    tags: ArticleTag[];
    count: number;
  }>;
  getArticleTag: (id: string) => Promise<ArticleTagDto | null>;
  getArticleTagByName: (name: string) => Promise<ArticleTagDto | null>;
  getArticleTagByPropsOr: (props: Array<Record<string, unknown>>) => Promise<ArticleTagDto | null>;
  getArticleTags: (ids: string[]) => Promise<ArticleTagDto[]>;
  listArticleTags: () => Promise<ArticleTagDto[]>;
}

export class ArticleTagQueriesRepo implements ArticleTagQueriesRepoI {
  constructor(private collection: Collection<ArticleTagDoc>) {}

  searchArticleCategories = async (
    query: SearchArticleCategoriesQueries,
  ): Promise<{
    tags: ArticleTag[];
    count: number;
  }> => {
    const { keyword = '', sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = query;
    const pipeline: Document[] = [
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
    ];

    const [result] = await this.collection.aggregate(pipeline).toArray();

    return {
      tags: result.tags.map((entity) => ArticleTagMapper.toDto(entity)),
      count: result.count,
    };
  };

  getArticleTag = async (id: string): Promise<ArticleTagDto | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    return ArticleTagMapper.toDto(doc);
  };

  getArticleTagByName = async (name: string): Promise<ArticleTagDto | null> => {
    const doc = await this.collection.findOne({ name });
    if (!doc) return null;

    return ArticleTagMapper.toDto(doc);
  };

  deleteArticleTag = (id: string) => this.collection.deleteOne({ _id: id });

  getArticleTagByPropsOr = async (props: Array<Record<string, unknown>>) => {
    const articleTagEntity = await this.collection.findOne({ $or: props });
    if (!articleTagEntity) return null;

    return ArticleTagMapper.toDto(articleTagEntity);
  };

  getArticleTags = async (ids: string[]): Promise<ArticleTagDto[]> => {
    const docs = await this.collection.find({ _id: { $in: ids } }).toArray();
    return ArticleTagMapper.toDtoList(docs);
  };

  listArticleTags = async (): Promise<ArticleTagDto[]> => {
    const docs = await this.collection.find({}).toArray();
    return ArticleTagMapper.toDtoList(docs);
  };
}
