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

export class AssetMapper {
  public static toDomain(entity): Result<Asset, DomainValidationError> {
    const AssetOrError = Asset.create({
      publicId: entity.publicId,
      width: entity.width,
      height: entity.height,
      format: entity.format,
      resourceType: entity.resourceType,
      createdAt: entity.createdAt,
      url: entity.url,
      secureUrl: entity.secureUrl,
      originalFilename: entity.originalFilename,
    });

    if (AssetOrError.isErr()) {
      return Result.fail(new DomainValidationError(AssetOrError.error.message));
    }

    const asset = AssetOrError.value;
    return Result.ok(asset);
  }

  static toDto(entity: any): AssetDto {
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

  static toDtoList(entities: any[]): AssetDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Asset): AssetPersistance {
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
}
