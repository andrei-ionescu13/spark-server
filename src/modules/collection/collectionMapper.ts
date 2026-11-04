import { AssetDto, AssetMapper, AssetPersistance } from '../../assetMapper';
import { MetaDto, MetaMapper, MetaPersistance } from '../../metaMapper';
import { Collection } from './domain/collection';
import { CollectionDescription } from './domain/collectionDescription';
import { CollectionTitle } from './domain/collectionTitle';
import { CollectionDoc, CollectionPopulatedDoc } from './model';
import { Asset } from '../../assets';
import { Meta } from '../../meta';
import { ProductDto, ProductMapper } from '../product/productMapper';

export interface CollectionDto {
  cover: AssetDto;
  title: string;
  description: string | null;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  meta: MetaDto;
  createdAt: Date;
  updatedAt: Date | null;
  _id: string;
  products: string[];
}

export interface CollectionPopulatedDto extends Omit<CollectionDto, 'products'> {
  products: ProductDto[];
}

export class CollectionMapper {
  public static toDomain(entity: CollectionDoc): Collection {
    const title = CollectionTitle.reconstitute(entity.title);
    const description = CollectionDescription.reconstitute(entity.description);
    const cover = Asset.reconstitute({
      publicId: entity.cover.public_id,
      width: entity.cover.width,
      height: entity.cover.height,
      format: entity.cover.format,
      resourceType: entity.cover.resource_type,
      createdAt: entity.cover.created_at,
      url: entity.cover.url,
      secureUrl: entity.cover.secure_url,
      originalFilename: entity.cover.original_filename,
      _id: entity.cover._id,
    });
    const meta = Meta.reconstitute({
      title: entity.meta.title,
      description: entity.meta.description,
      keywords: entity.meta.keywords,
    });

    const collection = Collection.reconstitute({
      ...entity,
      title,
      meta,
      description,
      cover,
    });

    return collection;
  }

  public static toDomainList(entities: CollectionDoc[]): Collection[] {
    const collections = entities.map((entity) => this.toDomain(entity));
    return collections;
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
      _id: entity._id,
      products: entity.products,
    };
  }

  static toDtoList(entities: CollectionDoc[]): CollectionDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPopulatedDto(entity: CollectionPopulatedDoc): CollectionPopulatedDto {
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
      _id: entity._id,
      products: ProductMapper.toDtoList(entity.products),
    };
  }

  static toPopulatedDtoList(entities: CollectionPopulatedDoc[]): CollectionPopulatedDto[] {
    return entities.map((entity) => this.toPopulatedDto(entity));
  }

  static toPersistance(entity: Collection): CollectionDoc {
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
      _id: entity._id,
      products: entity.products,
    };
  }
}
