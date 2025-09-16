import { Mapper } from '../mapper';
import { ArticleTag } from './articleTag';
import { ArticleTagEntity } from './model';

export const ArticleTagMapper: Mapper<ArticleTagEntity, ArticleTag> = {
  toDomain(entity) {
    return new ArticleTag({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });
  },
};
