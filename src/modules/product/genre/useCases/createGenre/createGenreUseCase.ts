import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../../appErrors';
import { Result } from '../../../../../results';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../useCaseErrors';
import { Genre } from '../../domain/genre';
import { GenreDto } from '../../genreMapper';
import { GenreCommandsRepoI } from '../../repo/commands';
import { GenreQueriesRepoI } from '../../repo/queries';
import { CreateGenreRequestDto } from './createGenreRequestDto';

export namespace CreateGenreErrors {
  export class NameNotAvailableError extends UseCaseError {
    constructor() {
      super('Name not available');
    }
  }

  export class SlugNotAvailableError extends UseCaseError {
    constructor() {
      super('Slug not available');
    }
  }

  export class ValidationError extends Error {
    constructor() {
      super('Genre could not be created');
    }
  }
}

type Response = Result<Genre, UseCaseErrors.UnexpectedError>;

export class CreateGenreUseCase implements UseCase<CreateGenreRequestDto, Response> {
  constructor(
    private genreCommandsRepo: GenreCommandsRepoI,
    private genreQueriesRepo: GenreQueriesRepoI,
  ) {}

  comparePropsToGenre = (
    props: Pick<CreateGenreRequestDto, 'name' | 'slug'>,
    genre: GenreDto,
  ): Result<
    undefined,
    CreateGenreErrors.NameNotAvailableError | CreateGenreErrors.SlugNotAvailableError
  > => {
    if (props.name === genre.name) {
      return Result.fail(new CreateGenreErrors.NameNotAvailableError());
    }

    if (props.slug === genre.slug) {
      return Result.fail(new CreateGenreErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: CreateGenreRequestDto): Promise<Response> => {
    const props = request;

    try {
      let existingGenre = await this.genreQueriesRepo.getGenreByPropsOr([
        { name: props.name, slug: props.slug },
      ]);

      if (existingGenre) {
        const result = this.comparePropsToGenre(props, existingGenre);

        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new CreateGenreErrors.ValidationError());
      }

      const genreOrError = Genre.create({
        name: props.name,
        slug: props.slug,
      });

      if (genreOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(genreOrError.error.message));
      }

      const genre = genreOrError.value;
      await this.genreCommandsRepo.save(genre);

      return Result.ok(genre);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
