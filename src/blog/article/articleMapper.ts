import { Meta } from '../../meta';
import { Result } from '../../Result';
import { Article } from './article';
import { Asset } from './asset';
import { Description } from './description';
import { Markdown } from './markdown';
import { ArticleDoc } from './model';
import { MappingValidationError, Status } from './status';
import { Title } from './title';

export interface ArticleDto {
  title: string;
  description: string;
  slug: string;
  status: 'draft' | 'published' | 'archived';
  category: {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date | null;
    _id: string;
  };
  markdown: string;
  cover: {
    public_id: string;
    width: number;
    height: number;
    format: string;
    resourceType?: 'image' | 'video' | 'raw' | 'auto';
    createdAt: string;
    url: string;
    secureUrl: string;
    originalFilename: string;
  };
  meta: string;
  createdAt: string;
  updatedAt: string;
  tags: {
    name: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date | null;
    _id: string;
  }[];
  _id: string;
}

export class ArticleMapper {
  static toDomain(entity: ArticleDoc): Result<Article, MappingValidationError> {
    const metaOrError = Meta.create({
      title: entity.meta.title,
      description: entity.meta.description,
      keywords: entity.meta.keywords,
    });
    const titleOrError = Title.create({ value: entity.title });
    const descriptionOrError = Description.create({ value: entity.description });
    const markdownOrError = Markdown.create({ value: entity.markdown });
    const statusOrError = Status.create({ value: entity.status });
    const coverOrError = Asset.create({
      publicId: entity.cover.public_id,
      width: entity.cover.width,
      height: entity.cover.height,
      format: entity.cover.format,
      resourceType: entity.cover.resource_type,
      createdAt: entity.cover.created_at,
      url: entity.cover.url,
      secureUrl: entity.cover.secure_url,
      originalFilename: entity.cover.original_filename,
    });

    const result = Result.combine([
      metaOrError,
      titleOrError,
      descriptionOrError,
      markdownOrError,
      statusOrError,
      coverOrError,
    ]);

    if (result.isErr()) {
      return Result.fail(new MappingValidationError(result.error.message));
    }

    const title = titleOrError.value;
    const description = descriptionOrError.value;
    const markdown = markdownOrError.value;
    const status = statusOrError.value;
    const meta = metaOrError.value;
    const cover = coverOrError.value;

    const article = Article.create({
      _id: entity._id,
      title,
      createdAt: entity.createdAt,
      description,
      slug: entity.slug,
      markdown,
      updatedAt: entity.updatedAt,
      status,
      category: entity.category,
      meta,
      tags: entity.tags,
      cover,
    });

    return Result.ok(article);
  }

  static toDto(entity: any): ArticleDto {
    return {
      title: entity.title,
      description: entity.description,
      slug: entity.slug,
      status: entity.status,
      category: entity.category,
      markdown: entity.markdown,
      cover: entity.cover,
      meta: entity.meta,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      tags: entity.tags,
      _id: entity._id,
    };
  }

  static toDtoList(entities: any[]): ArticleDto[] {
    return entities.map((entity) => ArticleMapper.toDto(entity));
  }
}
