import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../../Result';
import { Feature } from './feature';
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
  public static toDomain(entity: FeatureDoc): Result<Feature, DomainValidationError> {
    const featureOrError = Feature.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (featureOrError.isErr()) {
      return Result.fail(new DomainValidationError(featureOrError.error.message));
    }

    const feature = featureOrError.value;
    return Result.ok(feature);
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
