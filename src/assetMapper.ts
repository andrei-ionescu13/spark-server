import { Result } from './result';
import { DomainValidationError } from './modules/blog/article/domain/status';
import { Asset, AssetDoc } from './Asset';

export interface AssetDto {
  publicId: string;
  width: number;
  height: number;
  format: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  createdAt: string;
  url: string;
  secureUrl: string;
  originalFilename: string;
}

export interface AssetPersistance {
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
  created_at: string;
  url: string;
  secure_url: string;
  original_filename: string;
  _id: string;
}

export class AssetMapper {
  public static toDomain(entity: AssetDoc): Asset {
    const asset = Asset.reconstitute({
      publicId: entity.public_id,
      width: entity.width,
      height: entity.height,
      format: entity.format,
      resourceType: entity.resource_type,
      createdAt: entity.created_at,
      url: entity.url,
      secureUrl: entity.secure_url,
      originalFilename: entity.original_filename,
      _id: entity._id,
    });

    return asset;
  }

  public static toDomainList(entities: AssetDoc[]): Asset[] {
    const assets = entities.map((entity) => this.toDomain(entity));
    return assets;
  }

  public static toDto(entity: AssetDoc): AssetDto {
    return {
      publicId: entity.public_id,
      width: entity.width,
      height: entity.height,
      format: entity.format,
      resourceType: entity.resource_type,
      createdAt: entity.created_at,
      url: entity.url,
      secureUrl: entity.secure_url,
      originalFilename: entity.original_filename,
    };
  }

  public static toDtoList(entities: any[]): AssetDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  public static toPersistance(entity: Asset): AssetPersistance {
    return {
      public_id: entity.publicId,
      width: entity.width,
      height: entity.height,
      format: entity.format,
      resource_type: entity.resourceType,
      created_at: entity.createdAt,
      url: entity.url,
      secure_url: entity.secureUrl,
      original_filename: entity.originalFilename,
      _id: entity._id,
    };
  }

  public static toPersistanceList(entities: Asset[]): AssetPersistance[] {
    return entities.map((entity) => this.toPersistance(entity));
  }
}
