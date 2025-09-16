import { Asset } from '../../blog/article/asset';
import { AssetDto, AssetMapper, AssetPersistance } from '../../blog/article/assetMapper';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { Developer } from './developer';
import { DeveloperDoc } from './model';

export interface DeveloperDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetDto;
}

interface DeveloperPersistance {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetPersistance;
}

export class DeveloperMapper {
  public static toDomain(entity: DeveloperDoc): Result<Developer, DomainValidationError> {
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

    const developerOrError = Developer.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      logo,
    });

    if (developerOrError.isErr()) {
      return Result.fail(new DomainValidationError(developerOrError.error.message));
    }

    const developer = developerOrError.value;
    return Result.ok(developer);
  }

  static toDto(entity: any): DeveloperDto {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      logo: AssetMapper.toDto(entity.logo),
    };
  }

  static toDtoList(entities: any[]): DeveloperDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Developer): DeveloperPersistance {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      logo: AssetMapper.toPersistance(entity.logo),
    };
  }
}
