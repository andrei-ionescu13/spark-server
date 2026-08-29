import { Collection, ObjectId } from 'mongodb';
import { Result } from '../../../../Result';
import { Article } from '../article';
import { ArticleMapper } from '../articleMapper';
import { ArticleDoc } from '../model';
import { MappingValidationError } from '../status';

export interface ArticleCommandsRepoI {
  save: (article: Article) => Promise<void>;
  getArticle: (id: string) => Promise<Result<Article | null, MappingValidationError>>;
  deleteArticle: (id: string) => Promise<void>;
  deleteMultipleArticles: (ids: string[]) => Promise<void>;
  deleteArticleTag: (tagId: string) => Promise<void>;
}

export class ArticleCommandsRepo implements ArticleCommandsRepoI {
  constructor(private collection: Collection<ArticleDoc>) {}

  getArticle = async (id: string): Promise<Result<Article | null, MappingValidationError>> => {
    const articleEntity = await this.collection.findOne({ _id: id });
    if (!articleEntity) return Result.ok(null);

    const articleOrError = ArticleMapper.toDomain(articleEntity);
    if (articleOrError.isErr()) {
      return Result.fail(articleOrError.error);
    }

    return Result.ok(articleOrError.value);
  };

  save = async (article: Article) => {
    const persistance = ArticleMapper.toPersistence(article);
    await this.collection.updateOne(
      { _id: persistance._id },
      { set: persistance },
      { upsert: true },
    );
  };

  deleteArticle = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };

  deleteMultipleArticles = async (ids: string[]) => {
    await this.collection.deleteMany({ _id: { $in: ids } });
  };

  updateArticle = async (
    id: string,
    props: Record<string, unknown>,
  ): Promise<Result<Article | null, MappingValidationError>> => {
    const articleDocument = await this.collection.findOneAndUpdate(
      { _id: id },
      { $set: { ...props, updatedAt: new Date() } },
    );

    if (!articleDocument) return Result.ok(null);

    const articleOrError = ArticleMapper.toDomain(articleDocument);

    if (articleOrError.isErr()) {
      return Result.fail(articleOrError.error);
    }

    return Result.ok(articleOrError.value);
  };

  deleteArticleTag = async (tagId: string): Promise<void> => {
    await this.collection.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
  };
}
