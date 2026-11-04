import { AssetDto, AssetMapper, AssetPersistance } from '../../../assetMapper';
import { DomainValidationError } from '../../blog/article/domain/status';
import { Result } from '../../../results';
import { Developer } from './domain/developer';
import { DeveloperDoc } from './model';
import { Asset } from '../../../asset';

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
  public static toDomain(entity: DeveloperDoc): Developer {
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

    const developer = Developer.reconstitute({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      logo,
    });

    return developer;
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
