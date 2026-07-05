import { DomainValidationError } from './blog/article/status';
import { Meta, MetaDoc } from './meta';
import { Result } from './Result';

export interface MetaDto {
  title: string;
  description: string;
  keywords: string[];
}

export interface MetaPersistance {
  title: string;
  description: string;
  keywords: string[];
}

export class MetaMapper {
  public static toDomain(entity): Result<Meta, DomainValidationError> {
    const MetaOrError = Meta.create({
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    });

    if (MetaOrError.isErr()) {
      return Result.fail(new DomainValidationError(MetaOrError.error.message));
    }

    const meta = MetaOrError.value;
    return Result.ok(meta);
  }

  static toDto(entity: MetaDoc): MetaDto {
    return {
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    };
  }

  static toDtoList(entities: any[]): MetaDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Meta): MetaPersistance {
    return {
      title: entity.title,
      description: entity.description,
      keywords: entity.keywords,
    };
  }
}
