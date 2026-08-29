import { Asset } from '../../blog/article/asset';
import { AssetDto, AssetMapper, AssetPersistance } from '../../blog/article/assetMapper';
import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { PublisherDoc } from './model';
import { Publisher } from './publisher';

export interface PublisherDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetDto;
}

interface PublisherPersistance {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetPersistance;
}

export class PublisherMapper {
  public static toDomain(entity: PublisherDoc): Result<Publisher, DomainValidationError> {
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

    const publisherOrError = Publisher.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      logo,
    });

    if (publisherOrError.isErr()) {
      return Result.fail(new DomainValidationError(publisherOrError.error.message));
    }

    const publisher = publisherOrError.value;
    return Result.ok(publisher);
  }

  static toDto(entity: any): PublisherDto {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      logo: AssetMapper.toDto(entity.logo),
    };
  }

  static toDtoList(entities: any[]): PublisherDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Publisher): PublisherPersistance {
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
