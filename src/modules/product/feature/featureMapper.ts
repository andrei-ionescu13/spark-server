import { DomainValidationError } from '../../blog/article/domain/status';
import { Feature } from './domain/feature';
import { FeatureDoc } from './model';

export interface FeatureDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface FeaturePersistance {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class FeatureMapper {
  public static toDomain(entity: FeatureDoc): Feature {
    const feature = Feature.reconstitute({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return feature;
  }

  static toDto(entity: any): FeatureDto {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDtoList(entities: any[]): FeatureDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Feature): FeaturePersistance {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
