import { ArticleCategory } from './domain/articleCategory';
import { ArticleCategoryDoc } from './model';

export interface ArticleCategoryDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ArticleCategoryMapper {
  static toDomain(entity: ArticleCategoryDoc): ArticleCategory {
    const category = ArticleCategory.reconstitute({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return category;
  }

  static toDomainList(entities: ArticleCategoryDoc[]): ArticleCategory[] {
    const categories = entities.map((entity) => this.toDomain(entity));
    return categories;
  }

  static toDto(doc: ArticleCategoryDoc): ArticleCategoryDto {
    return {
      _id: doc._id,
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }

  static toDtoList(entities: ArticleCategoryDoc[]): ArticleCategoryDto[] {
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
