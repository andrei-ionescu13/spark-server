import { AssetDoc } from '../../Asset';
import { Result } from '../../Result';
import { Asset } from './asset';
import { DomainValidationError } from './status';

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
}

export class AssetMapper {
  public static toDomain(entity: AssetDoc): Result<Asset, DomainValidationError> {
    const assetOrError = Asset.create({
      publicId: entity.public_id,
      width: entity.width,
      height: entity.height,
      format: entity.format,
      resourceType: entity.resource_type,
      createdAt: entity.created_at,
      url: entity.url,
      secureUrl: entity.secure_url,
      originalFilename: entity.original_filename,
    });

    if (assetOrError.isErr()) {
      return Result.fail(new DomainValidationError(assetOrError.error.message));
    }

    const asset = assetOrError.value;
    return Result.ok(asset);
  }

  public static toDomainList(entities: AssetDoc[]): Result<Asset[], DomainValidationError> {
    const results = entities.map((entity) => this.toDomain(entity));
    const assetsOrError = Result.combine(results);

    if (assetsOrError.isErr()) {
      return Result.fail(new DomainValidationError(assetsOrError.error.message));
    }

    const assets = results.map((assetOrError) => assetOrError.value);
    return Result.ok(assets);
  }

  public static toDto(entity: any): AssetDto {
    return {
      publicId: entity.publicId,
      width: entity.width,
      height: entity.height,
      format: entity.format,
      resourceType: entity.resourceType,
      createdAt: entity.createdAt,
      url: entity.url,
      secureUrl: entity.secureUrl,
      originalFilename: entity.originalFilename,
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
    };
  }

  public static toPersistanceList(entities: Asset[]): AssetPersistance[] {
    return entities.map((entity) => this.toPersistance(entity));
  }
}
