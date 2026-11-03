import { DomainValidationError } from '../../blog/article/domain/status';
import { Genre } from './domain/genre';
import { GenreDoc } from './model';

export interface GenreDto {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

interface GenrePersistance {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class GenreMapper {
  public static toDomain(entity: GenreDoc): Genre {
    const genre = Genre.reconstitute({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    return genre;
  }

  static toDto(entity: any): GenreDto {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDtoList(entities: any[]): GenreDto[] {
    return entities.map((entity) => this.toDto(entity));
  }

  static toPersistance(entity: Genre): GenrePersistance {
    return {
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
