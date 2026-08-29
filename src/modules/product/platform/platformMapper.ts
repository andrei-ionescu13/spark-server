import { Asset } from '../../blog/article/asset';
import { AssetDto, AssetMapper, AssetPersistance } from '../../blog/article/assetMapper';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { PlatformDoc } from './model';
import { Platform } from './platform';

export interface PlatformDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetDto;
  url: string;
}

interface PlatformPersistance {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetPersistance;
  url: string;
}

export class PlatformMapper {
  public static toDomain(entity: PlatformDoc): Result<Platform, DomainValidationError> {
    const logoOrError = Asset.create({
      publicId: entity.logo.public_id,
      width: entity.logo.width,
      height: entity.logo.height,
      format: entity.logo.format,
      resourceType: entity.logo.resource_type,
      createdAt: entity.logo.created_at,
      url: entity.logo.url,
      secureUrl: entity.logo.secure_url,
      originalFilename: entity.logo.original_filename,
    });

    if (logoOrError.isErr()) {
      return Result.fail(new DomainValidationError(logoOrError.error.message));
    }
    const logo = logoOrError.value;

    const platformOrError = Platform.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      url: entity.url,
      logo,
    });

    if (platformOrError.isErr()) {
      return Result.fail(new DomainValidationError(platformOrError.error.message));
    }

    const platform = platformOrError.value;
    return Result.ok(platform);
  }

  static toDto(entity: any): PlatformDto {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
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
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      url: entity.url,
      logo: AssetMapper.toPersistance(entity.logo),
    };
  }
}
