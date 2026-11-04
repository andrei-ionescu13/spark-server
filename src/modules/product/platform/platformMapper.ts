import { AssetDto, AssetMapper, AssetPersistance } from '../../../assetMapper';
import { DomainValidationError } from '../../blog/article/domain/status';
import { PlatformDoc } from './model';
import { Platform } from './domain/platform';
import { Asset } from '../../../assets';

export interface PlatformDto {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetDto;
  url: string;
}

interface PlatformPersistance {
  _id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetPersistance;
  url: string;
}

export class PlatformMapper {
  public static toDomain(entity: PlatformDoc): Platform {
    const logo = Asset.reconstitute({
      publicId: entity.logo.public_id,
      width: entity.logo.width,
      height: entity.logo.height,
      format: entity.logo.format,
      resourceType: entity.logo.resource_type,
      createdAt: entity.logo.created_at,
      url: entity.logo.url,
      secureUrl: entity.logo.secure_url,
      originalFilename: entity.logo.original_filename,
      _id: entity._id,
    });

    const platform = Platform.reconstitute({
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      url: entity.url,
      logo,
    });

    return platform;
  }

  static toDto(entity: any): PlatformDto {
    return {
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      url: entity.url,
      logo: AssetMapper.toDto(entity.logo),
    };
  }

  static toDtoList(entities: any[]): PlatformDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Platform): PlatformPersistance {
    return {
      _id: entity._id,
      name: entity.name,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      url: entity.url,
      logo: AssetMapper.toPersistance(entity.logo),
    };
  }
}
