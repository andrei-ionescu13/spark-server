import { Meta } from '../../Meta';
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
  static toDomain(doc: ArticleDoc): Result<Article, MappingValidationError> {
    const metaOrError = Meta.create({
      title: doc.meta.title,
      description: doc.meta.description,
      keywords: doc.meta.keywords,
    });
    const titleOrError = Title.create({ value: doc.title });
    const descriptionOrError = Description.create({ value: doc.description });
    const markdownOrError = Markdown.create({ value: doc.markdown });
    const statusOrError = Status.create({ value: doc.status });
    const coverOrError = Asset.create({
      publicId: doc.cover.public_id,
      width: doc.cover.width,
      height: doc.cover.height,
      format: doc.cover.format,
      resourceType: doc.cover.resource_type,
      createdAt: doc.cover.created_at,
      url: doc.cover.url,
      secureUrl: doc.cover.secure_url,
      originalFilename: doc.cover.original_filename,
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
