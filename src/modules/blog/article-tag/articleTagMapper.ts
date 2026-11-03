import { ArticleTag } from './domain/articleTag';
import { ArticleTagDoc } from './model';

export interface ArticleTagDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class ArticleTagMapper {
  static toDomain(doc: ArticleTagDoc): ArticleTag {
    const articleTag = ArticleTag.reconstitute({
      _id: doc._id,
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });

    return articleTag;
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
