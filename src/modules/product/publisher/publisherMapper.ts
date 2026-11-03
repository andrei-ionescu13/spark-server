import { AssetDto, AssetMapper } from '../../../assetMapper';
import { Publisher } from './domain/publisher';
import { PublisherDoc } from './model';

export interface PublisherDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
  logo: AssetDto;
}

export class PublisherMapper {
  static toDomain(doc: PublisherDoc): Publisher {
    const publiser = Publisher.reconstitute({
      _id: doc._id,
      name: doc.name,
      slug: doc.slug,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
      logo: AssetMapper.toDomain(doc.logo),
    });

    return publiser;
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

  static toPersistance(entity: Publisher): PublisherDoc {
    return {
      _id: entity._id,
      createdAt: entity.createdAt,
      logo: AssetMapper.toPersistance(entity.logo),
      name: entity.name,
      slug: entity.slug,
      updatedAt: entity.updatedAt,
    };
  }
}
