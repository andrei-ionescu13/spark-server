import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { UseCaseError } from '../../../../UseCaseError';
import { ProductQueriesRepoI } from '../../../repo/queries';
import { GenreCommandsRepoI } from '../../repo/commands';
import { GenreQueriesRepoI } from '../../repo/queries';
import { DeleteGenreBulkRequestDto } from './deleteGenreBulkRequestDto';

export namespace DeleteGenreBulkErrors {
  export class GenreIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this genre');
    }
  }
}

type Response = Result<undefined, UseCaseErrors.UnexpectedError>;

export class DeleteGenreBulkUseCase implements UseCase<DeleteGenreBulkRequestDto, Response> {
  constructor(
    private productQueriesRepo: ProductQueriesRepoI,
    private genreCommandsRepo: GenreCommandsRepoI,
    private genreQueriesRepo: GenreQueriesRepoI,
  ) {}

  deleteGenre = async (genreId: string) => {
    const genre = await this.genreQueriesRepo.getGenre(genreId);
    if (!genre) {
      return Result.fail(new UseCaseErrors.NotFound('Genre not found'));
    }

    const product = await this.productQueriesRepo.getProductByGenre(genreId);
    if (!product) {
      return Result.fail(new DeleteGenreBulkErrors.GenreIsUsed());
    }

    await this.genreCommandsRepo.deleteGenre(genreId);

    return Result.ok();
  };

  execute = async (request: DeleteGenreBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const result = Result.combine(
        await Promise.all(ids.map((genreId) => this.deleteGenre(genreId))),
      );

      if (result.isErr()) {
        return Result.fail(result.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
