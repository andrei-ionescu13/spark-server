import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../../Result';
import { Article } from '../article';
import { ArticleMapper } from '../articleMapper';
import { ArticleDoc } from '../model';
import { MappingValidationError } from '../status';

export interface ArticleCommandRepoI {
  createArticle: (props) => Promise<Result<Article, MappingValidationError>>;
  getArticle: (id: string) => Promise<Result<Article | null, MappingValidationError>>;
  deleteArticle: (id: string) => Promise<void>;
  deleteMultipleArticles: (ids: string[]) => Promise<void>;
  updateArticle: (
    id: string,
    props: Record<string, unknown>,
  ) => Promise<Result<Article | null, MappingValidationError>>;
  deleteArticleTag: (tagId: string) => Promise<void>;
}

export class ArticleCommandRepo implements ArticleCommandRepoI {
  constructor(private articleModel: Model<ArticleDoc>) {}

  getArticle = async (id: string): Promise<Result<Article | null, MappingValidationError>> => {
    const articleEntity = await this.articleModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!articleEntity) return Result.ok(null);

    const articleOrError = ArticleMapper.toDomain(articleEntity);
    if (articleOrError.isErr()) {
      return Result.fail(articleOrError.error);
    }

    return Result.ok(articleOrError.value);
  };

  createArticle = async (props): Promise<Result<Article, MappingValidationError>> => {
    const articleEntity = await this.articleModel.create(props);
    const articleOrError = ArticleMapper.toDomain(articleEntity);

    if (articleOrError.isErr()) {
      return Result.fail(articleOrError.error);
    }

    return Result.ok(articleOrError.value);
  };

  deleteArticle = async (id: string) => {
    await this.articleModel.deleteOne({ _id: id });
  };

  deleteMultipleArticles = async (ids: string[]) => {
    await this.articleModel.deleteMany({ _id: { $in: ids } });
  };

  updateArticle = async (
    id: string,
    props: Record<string, unknown>,
  ): Promise<Result<Article | null, MappingValidationError>> => {
    const articleDocument = await this.articleModel
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...props, updatedAt: new Date() } },
        { new: true },
      )
      .populate('category tags')
      .lean();

    if (!articleDocument) return Result.ok(null);

    const articleOrError = ArticleMapper.toDomain(articleDocument);

    if (articleOrError.isErr()) {
      return Result.fail(articleOrError.error);
    }

    return Result.ok(articleOrError.value);
  };

  deleteArticleTag = async (tagId: string): Promise<void> => {
    await this.articleModel.updateMany({ tags: tagId }, { $pull: { tags: tagId } });
  };
}
