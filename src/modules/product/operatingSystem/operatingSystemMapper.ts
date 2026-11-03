import { OperatingSystem } from './domain/operatingSystem';
import { OperatingSystemDoc } from './model';

export interface OperatingSystemDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface OperatingSystempersistence {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class OperatingSystemMapper {
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

  static toDomain(entity: OperatingSystemDoc): OperatingSystem {
    const operatingSystem = OperatingSystem.reconstitute({
      name: entity.name,
      slug: entity.slug,
      _id: entity._id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return operatingSystem;
  }

  static toPersistance(entity: OperatingSystem): OperatingSystemDoc {
    return {
      _id: entity._id,
      createdAt: entity.createdAt,
      name: entity.name,
      slug: entity.slug,
      updatedAt: entity.updatedAt,
    };
  }
}
