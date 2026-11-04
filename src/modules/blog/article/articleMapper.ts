import { Meta } from '../../../meta';
import { Article } from './domain/article';
import { AssetDto, AssetMapper } from '../../../assetMapper';
import { ArticleMarkdown } from './domain/markdown';
import { ArticleDoc, ArticlePopulatedDoc } from './model';
import { MappingValidationError, ArticleStatus } from './domain/status';
import { ArticleTitle } from './domain/title';
import { Asset } from '../../../assets';
import { Result } from '../../../results';
import { ArticleDescription } from './domain/description';
import { ArticleCategory } from '../article-category/domain/articleCategory';
import {
  ArticleCategoryDto,
  ArticleCategoryMapper,
} from '../article-category/articleCategoryMapper';
import { ArticleTag } from '../article-tag/domain/articleTag';
import { MetaDto, MetaMapper } from '../../../metaMapper';
import { ArticleTagDto, ArticleTagMapper } from '../article-tag/articleTagMapper';

export interface ArticleDto {
  title: string;
  description: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  category: string;
  markdown: string;
  cover: AssetDto;
  meta: MetaDto;
  createdAt: Date;
  updatedAt: Date | null;
  tags: string[];
  _id: string;
}

export interface ArticlePopulatedDto {
  title: string;
  description: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  category: ArticleCategoryDto;
  markdown: string;
  cover: AssetDto;
  meta: MetaDto;
  createdAt: Date;
  updatedAt: Date | null;
  tags: ArticleTagDto[];
  _id: string;
}

export class ArticleMapper {
  static toDomain(doc: ArticleDoc): Article {
    const meta = Meta.reconstitute({
      title: doc.meta.title,
      description: doc.meta.description,
      keywords: doc.meta.keywords,
    });
    const title = ArticleTitle.reconstitute(doc.title);
    const description = ArticleDescription.reconstitute(doc.description);
    const markdown = ArticleMarkdown.reconstitute(doc.markdown);
    const status = ArticleStatus.reconstitute(doc.status);
    const cover = Asset.reconstitute({
      publicId: doc.cover.public_id,
      width: doc.cover.width,
      height: doc.cover.height,
      format: doc.cover.format,
      resourceType: doc.cover.resource_type,
      createdAt: doc.cover.created_at,
      url: doc.cover.url,
      secureUrl: doc.cover.secure_url,
      originalFilename: doc.cover.original_filename,
      _id: doc.cover._id,
    });

    const article = Article.reconstitute({
      _id: doc._id,
      title,
      createdAt: doc.createdAt,
      description,
      slug: doc.slug,
      markdown,
      updatedAt: doc.updatedAt,
      status,
      category: doc.category,
      meta,
      tags: doc.tags,
      cover,
    });

    return article;
  }

  static toDto(entity: ArticleDoc): ArticleDto {
    return {
      title: entity.title,
      description: entity.description,
      slug: entity.slug,
      status: entity.status,
      category: entity.category,
      markdown: entity.markdown,
      cover: AssetMapper.toDto(entity.cover),
      meta: MetaMapper.toDto(entity.meta),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tags: entity.tags,
      _id: entity._id,
    };
  }

  static toDtoList(entities: ArticleDoc[]): ArticleDto[] {
    return entities.map((entity) => ArticleMapper.toDto(entity));
  }

  static toPopulatedDto(entity: ArticlePopulatedDoc): ArticlePopulatedDto {
    return {
      title: entity.title,
      description: entity.description,
      slug: entity.slug,
      status: entity.status,
      category: ArticleCategoryMapper.toDto(entity.category),
      markdown: entity.markdown,
      cover: AssetMapper.toDto(entity.cover),
      meta: MetaMapper.toDto(entity.meta),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tags: ArticleTagMapper.toDtoList(entity.tags),
      _id: entity._id,
    };
  }

  static toPopulatedDtoList(entities: ArticlePopulatedDoc[]): ArticlePopulatedDto[] {
    return entities.map((entity) => ArticleMapper.toPopulatedDto(entity));
  }

  static toPersistence(article: Article): ArticleDoc {
    return {
      title: article.title.value,
      description: article.description.value,
      slug: article.slug,
      status: article.status.value,
      category: article.category,
      markdown: article.markdown.value,
      cover: AssetMapper.toPersistance(article.cover),
      meta: MetaMapper.toPersistance(article.meta),
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      tags: article.tags,
      _id: article._id,
    };
  }
}
