import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { OperatingSystemDoc } from './model';
import { OperatingSystem } from './operatingSystem';

export interface OperatingSystemDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface OperatingSystemPersistance {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class OperatingSystemMapper {
  public static toDomain(
    entity: OperatingSystemDoc,
  ): Result<OperatingSystem, DomainValidationError> {
    const operatingSystemOrError = OperatingSystem.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (operatingSystemOrError.isErr()) {
      return Result.fail(new DomainValidationError(operatingSystemOrError.error.message));
    }

    const operatingSystem = operatingSystemOrError.value;
    return Result.ok(operatingSystem);
  }

  static toDto(entity: any): OperatingSystemDto {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDtoList(entities: any[]): OperatingSystemDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: OperatingSystem): OperatingSystemPersistance {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
