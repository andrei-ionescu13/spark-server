import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';
import { Result } from '../../../Result';
import { MappingValidationError } from '../../article/status';
import { ArticleCategory } from '../articleCategory';
import { ArticleCategoryMapper } from '../articleCategoryMapper';
import { ArticleCategoryDoc } from '../model';

export interface ArticleCategoryCommandRepoI {
  save: (articleCategory: ArticleCategory) => Promise<void>;
  getArticleCategory: (
    id: string,
  ) => Promise<Result<ArticleCategory | null, MappingValidationError>>;
  createArticleCategory: (
    props: Record<string, unknown>,
  ) => Promise<Result<ArticleCategory, MappingValidationError>>;
  deleteArticleCategory: (id: string) => Promise<void>;
  updateArticleCategory: (
    id: string,
    props: Record<string, unknown>,
  ) => Promise<Result<ArticleCategory | null, MappingValidationError>>;
}

export class ArticleCategoryCommandRepo implements ArticleCategoryCommandRepoI {
  constructor(private articleCategoryModel: Model<ArticleCategoryDoc>) {}

  save = async (articleCategory: ArticleCategory) => {
    const persistence = ArticleCategoryMapper.toPersistance(articleCategory);

    await this.articleCategoryModel.updateOne(
      { _id: articleCategory._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getArticleCategory = async (
    id: string,
  ): Promise<Result<ArticleCategory | null, MappingValidationError>> => {
    const entity = await this.articleCategoryModel.findOne({ _id: new ObjectId(id) }).lean();
    if (!entity) return Result.ok(null);

    const articleCategoryOrError = ArticleCategoryMapper.toDomain(entity);

    if (articleCategoryOrError.isErr()) {
      return Result.fail(new MappingValidationError(articleCategoryOrError.error.message));
    }

    return Result.ok(articleCategoryOrError.value);
  };

  createArticleCategory = async (
    props: Record<string, unknown>,
  ): Promise<Result<ArticleCategory, MappingValidationError>> => {
    const articleCategoryEntity = await this.articleCategoryModel.create(props);
    const articleCategoryOrError = ArticleCategoryMapper.toDomain(articleCategoryEntity);

    if (articleCategoryOrError.isErr()) {
      return Result.fail(new MappingValidationError(articleCategoryOrError.error.message));
    }

    return Result.ok(articleCategoryOrError.value);
  };

  updateArticleCategory = async (
    id: string,
    props: Record<string, unknown>,
  ): Promise<Result<ArticleCategory | null, MappingValidationError>> => {
    const entity = await this.articleCategoryModel.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { ...props, updatedAt: Date.now() } },
      { new: true },
    );

    if (!entity) return Result.ok(null);

    const articleCategoryOrError = ArticleCategoryMapper.toDomain(entity);
    if (articleCategoryOrError.isErr()) {
      return Result.fail(new MappingValidationError(articleCategoryOrError.error.message));
    }

    return Result.ok(articleCategoryOrError.value);
  };

  getArticleCategoryByPropsOr = async (props: Array<Record<string, any>>) => {
    const entity = await this.articleCategoryModel.findOne({ $or: props }).lean();

    if (!entity) return null;
    return ArticleCategoryMapper.toDomain(entity);
  };

  deleteArticleCategory = async (id: string) => {
    await this.articleCategoryModel.deleteOne({ _id: id });
  };

  listArticleCategories = async () => {
    const entities = await this.articleCategoryModel.find({});
    return entities.map((entity) => ArticleCategoryMapper.toDomain(entity));
  };
}
