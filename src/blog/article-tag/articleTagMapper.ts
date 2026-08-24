import { Result } from '../../Result';
import { DomainValidationError, MappingValidationError } from '../article/status';
import { Mapper } from '../mapper';
import { ArticleTag } from './articleTag';
import { ArticleTagDoc } from './model';

export interface ArticleTagDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ArticleTagMapper {
  static toDomain(doc: ArticleTagDoc): Result<ArticleTag, DomainValidationError> {
    const articleTagOrError = ArticleTag.create({
      _id: doc._id,
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });

    if (articleTagOrError.isErr()) {
      return Result.fail(new MappingValidationError(articleTagOrError.error?.message));
    }

    return Result.ok(articleTagOrError.value);
  }

  static toDto(doc: ArticleTagDoc): ArticleTagDto {
    return {
      _id: doc._id,
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toDtoList(docs: ArticleTagDoc[]): ArticleTagDto[] {
    return docs.map((doc) => ArticleTagMapper.toDto(doc));
  }

  static toPersistance(entity: ArticleTag): ArticleTagDoc {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
