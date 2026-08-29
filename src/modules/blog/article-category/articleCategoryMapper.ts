import { Result } from '../../../Result';
import { MappingValidationError } from '../article/status';
import { ArticleCategory } from './articleCategory';
import { ArticleCategoryDoc } from './model';

export interface ArticleCategoryDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ArticleCategoryMapper {
  static toDomain(entity: ArticleCategoryDoc): Result<ArticleCategory, MappingValidationError> {
    const categoryOrError = ArticleCategory.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (categoryOrError.isErr()) {
      return Result.fail(new MappingValidationError(categoryOrError.error.message));
    }

    return Result.ok(categoryOrError.value);
  }

  static toDomainList(
    entities: ArticleCategoryDoc[],
  ): Result<ArticleCategory[], MappingValidationError> {
    const categoriesOrErrors = entities.map((entity) => this.toDomain(entity));
    const combinedResults = Result.combine(categoriesOrErrors);

    if (combinedResults.isErr()) {
      return Result.fail(new MappingValidationError(combinedResults.error.message));
    }

    return Result.ok(combinedResults.value);
  }

  static toDto(doc: any): ArticleCategoryDto {
    return {
      _id: doc._id,
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toDtoList(entities: any[]): ArticleCategoryDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: ArticleCategory): ArticleCategoryDoc {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
