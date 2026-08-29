import { Asset } from '../blog/article/asset';
import { AssetDto, AssetMapper, AssetPersistance } from '../blog/article/assetMapper';
import { DomainValidationError } from '../blog/article/status';
import { Meta } from '../../meta';
import { MetaDto, MetaMapper, MetaPersistance } from '../../metaMapper';
import { Result } from '../../Result';
import { Collection } from './collection';
import { CollectionDescription } from './collectionDescription';
import { CollectionTitle } from './collectionTitle';
import { CollectionDoc } from './model';

export interface CollectionDto {
  cover: AssetDto;
  title: string;
  description: string | null;
  slug: string;
  startDate: Date;
  endDate: Date;
  meta: MetaDto;
  createdAt: Date;
  updatedAt: Date | null;
  isDeal: boolean;
  _id: string;
}

export interface CollectionPersistance {
  cover: AssetPersistance;
  title: string;
  description: string | null;
  slug: string;
  startDate: Date;
  endDate: Date;
  meta: MetaPersistance;
  createdAt: Date;
  updatedAt: Date | null;
  isDeal: boolean;
  _id: string;
}

export class CollectionMapper {
  public static toDomain(entity: CollectionDoc): Result<Collection, DomainValidationError> {
    const titleOrError = CollectionTitle.create(entity.title);
    const descriptionOrError = CollectionDescription.create(entity.description);
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
    const metaOrError = Meta.create({
      title: entity.meta.title,
      description: entity.meta.description,
      keywords: entity.meta.keywords,
    });

    const result = Result.combine([titleOrError, descriptionOrError, coverOrError, metaOrError]);

    if (result.isErr()) {
      return Result.fail(new DomainValidationError(result.error.message));
    }

    const title = titleOrError.value;
    const description = descriptionOrError.value;
    const cover = coverOrError.value;
    const meta = metaOrError.value;

    const collectionOrError = Collection.create({
      ...entity,
      title,
      meta,
      description,
      cover,
    });

    if (collectionOrError.isErr()) {
      return Result.fail(new DomainValidationError(collectionOrError.error.message));
    }

    const developer = collectionOrError.value;
    return Result.ok(developer);
  }

  public static toDomainList(
    entities: CollectionDoc[],
  ): Result<Collection[], DomainValidationError> {
    const colelctionsOrErrors = entities.map((entity) => this.toDomain(entity));
    const combinedResults = Result.combine(colelctionsOrErrors);

    if (combinedResults.isErr()) {
      return Result.fail(new DomainValidationError(combinedResults.error.message));
    }

    return Result.ok(combinedResults.value);
  }

  static toDto(entity: CollectionDoc): CollectionDto {
    return {
      cover: AssetMapper.toDto(entity.cover),
      title: entity.title,
      description: entity.description,
      slug: entity.slug,
      startDate: entity.startDate,
      endDate: entity.endDate,
      meta: MetaMapper.toDto(entity.meta),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isDeal: entity.isDeal,
      _id: entity._id,
    };
  }

  static toDtoList(entities: any[]): CollectionDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Collection): CollectionPersistance {
    return {
      cover: AssetMapper.toPersistance(entity.cover),
      title: entity.title.value,
      description: entity.description.value,
      slug: entity.slug,
      startDate: entity.startDate,
      endDate: entity.endDate,
      meta: MetaMapper.toPersistance(entity.meta),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      isDeal: entity.isDeal,
      _id: entity._id,
    };
  }
}
