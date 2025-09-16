import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { GenreDto } from '../../genreMapper';
import { GenreDoc } from '../../model';
import { GenreCommandsRepoI } from '../../repo/commands';
import { GenreQueriesRepoI } from '../../repo/queries';
import { UpdateGenreRequestDto } from './updateGenreRequestDto';

export namespace UpdateGenreErrors {
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

  export class PropsNotAvailable extends UseCaseError {
    constructor() {
      super('Fields not available');
    }
  }
}

type Response = Result<
  GenreDoc,
  | UpdateGenreErrors.NameNotAvailableError
  | UpdateGenreErrors.SlugNotAvailableError
  | UseCaseErrors.UnexpectedError
  | UseCaseErrors.NotFound
>;

export class UpdateGenreUseCase implements UseCase<UpdateGenreRequestDto, Response> {
  constructor(
    private genreCommandsRepo: GenreCommandsRepoI,
    private genreQueriesRepo: GenreQueriesRepoI,
  ) {}

  comparePropsToGenre = (
    props: Pick<UpdateGenreRequestDto, 'name' | 'slug'>,
    genre: GenreDto,
  ): Result<
    undefined,
    UpdateGenreErrors.NameNotAvailableError | UpdateGenreErrors.SlugNotAvailableError
  > => {
    if (props.name === genre.name) {
      return Result.fail(new UpdateGenreErrors.NameNotAvailableError());
    }

    if (props.slug === genre.slug) {
      return Result.fail(new UpdateGenreErrors.SlugNotAvailableError());
    }

    return Result.ok();
  };

  execute = async (request: UpdateGenreRequestDto): Promise<Response> => {
    const { genreId, ...props } = request;

    try {
      const genreOrError = await this.genreCommandsRepo.getGenre(genreId);
      if (genreOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(genreOrError.error.message));
      }

      const genre = genreOrError.value;
      if (!genre) {
        return Result.fail(new UseCaseErrors.NotFound('Article tag not found'));
      }

      const genreFound = await this.genreQueriesRepo.getGenreByPropsOr([
        { slug: props.slug },
        { name: props.name },
      ]);

      if (genreFound) {
        const result = this.comparePropsToGenre(props, genreFound);
        if (result.isErr()) {
          return Result.fail(result.error);
        }

        return Result.fail(new UpdateGenreErrors.PropsNotAvailable());
      }

      const updateResult = genre.update(props.name, props.slug);
      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      return Result.ok(genre);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
