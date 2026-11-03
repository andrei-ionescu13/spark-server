import { Collection } from 'mongodb';
import { Article } from '../domain/article';
import { ArticleMapper } from '../articleMapper';
import { ArticleDoc } from '../model';
import { MappingValidationError } from '../domain/status';

export interface ArticleCommandsRepoI {
  save: (article: Article) => Promise<void>;
  getArticle: (id: string) => Promise<Article | null>;
  deleteArticle: (id: string) => Promise<void>;
  deleteMultipleArticles: (ids: string[]) => Promise<void>;
  deleteArticleTag: (tagId: string) => Promise<void>;
}

export class ArticleCommandsRepo implements ArticleCommandsRepoI {
  constructor(private collection: Collection<ArticleDoc>) {}

  getArticle = async (id: string): Promise<Article | null> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return null;

    const article = ArticleMapper.toDomain(doc);
    return article;
  };

  save = async (article: Article) => {
    const persistence = ArticleMapper.toPersistence(article);
    await this.collection.updateOne({ _id: article._id }, { $set: persistence }, { upsert: true });
  };

  deleteArticle = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };

  deleteMultipleArticles = async (ids: string[]) => {
    await this.collection.deleteMany({ _id: { $in: ids } });
  };

  deleteArticleTag = async (tagId: string): Promise<void> => {
    await this.collection.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
  };
}
