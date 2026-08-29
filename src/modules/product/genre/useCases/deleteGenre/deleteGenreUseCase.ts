import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { UseCaseError } from '../../../../../UseCaseError';
import { ProductQueriesRepoI } from '../../../repo/queries';
import { GenreCommandsRepoI } from '../../repo/commands';
import { GenreQueriesRepoI } from '../../repo/queries';
import { DeleteGenreRequestDto } from './deleteGenrerRequestDto';

export namespace DeleteGenreErrors {
  export class GenreIsUsed extends UseCaseError {
    constructor() {
      super('A Product is using this genre');
    }
  }
}

type Response = Result<
  undefined,
  DeleteGenreErrors.GenreIsUsed | UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError
>;

export class DeleteGenreUseCase implements UseCase<DeleteGenreRequestDto, Response> {
  constructor(
    private productQueriesRepo: ProductQueriesRepoI,
    private genreCommandsRepo: GenreCommandsRepoI,
    private genreQueriesRepo: GenreQueriesRepoI,
  ) {}

  execute = async (request: DeleteGenreRequestDto): Promise<Response> => {
    const { genreId } = request;

    try {
      const genre = await this.genreQueriesRepo.getGenre(genreId);
      if (!genre) {
        return Result.fail(new UseCaseErrors.NotFound('Genre not found'));
      }

      const product = await this.productQueriesRepo.getProductByGenre(genreId);
      if (!product) {
        return Result.fail(new DeleteGenreErrors.GenreIsUsed());
      }

      await this.genreCommandsRepo.deleteGenre(genreId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
