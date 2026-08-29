import { Collection, ObjectId } from 'mongodb';
import { Result } from '../../../../Result';
import { MappingValidationError } from '../../article/status';
import { ArticleCategory } from '../articleCategory';
import { ArticleCategoryMapper } from '../articleCategoryMapper';
import { ArticleCategoryDoc } from '../model';

export interface ArticleCategoryCommandsRepoI {
  save: (articleCategory: ArticleCategory) => Promise<void>;
  getArticleCategory: (
    id: string,
  ) => Promise<Result<ArticleCategory | null, MappingValidationError>>;
  deleteArticleCategory: (id: string) => Promise<void>;
}

export class ArticleCategoryCommandsRepo implements ArticleCategoryCommandsRepoI {
  constructor(private collection: Collection<ArticleCategoryDoc>) {}

  save = async (articleCategory: ArticleCategory) => {
    const persistence = ArticleCategoryMapper.toPersistance(articleCategory);

    await this.collection.updateOne(
      { _id: articleCategory._id },
      { $set: persistence },
      { upsert: true },
    );
  };

  getArticleCategory = async (
    id: string,
  ): Promise<Result<ArticleCategory | null, MappingValidationError>> => {
    const doc = await this.collection.findOne({ _id: id });
    if (!doc) return Result.ok(null);

    const articleCategoryOrError = ArticleCategoryMapper.toDomain(doc);

    if (articleCategoryOrError.isErr()) {
      return Result.fail(new MappingValidationError(articleCategoryOrError.error.message));
    }

    return Result.ok(articleCategoryOrError.value);
  };

  deleteArticleCategory = async (id: string) => {
    await this.collection.deleteOne({ _id: id });
  };

  listArticleCategories = async () => {
    const entities = await this.collection.find({});
    return entities.map((entity) => ArticleCategoryMapper.toDomain(entity));
  };
}
