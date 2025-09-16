import { DomainValidationError } from '../../blog/article/status';
import { Result } from '../../Result';
import { Genre } from './genre';
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
  public static toDomain(entity: GenreDoc): Result<Genre, DomainValidationError> {
    const genreOrError = Genre.create({
      _id: entity._id,
      name: entity.name,
      slug: entity.slug,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    });

    if (genreOrError.isErr()) {
      return Result.fail(new DomainValidationError(genreOrError.error.message));
    }

    const genre = genreOrError.value;
    return Result.ok(genre);
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
