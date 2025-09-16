import { ProductRepoI } from '../../../../../product/productRepo';
import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { GenreCommandsRepoI } from '../../repo/commands';
import { GenreQueriesRepoI } from '../../repo/queries';
import { DeleteGenreRequestDto } from './deleteGenrerRequestDto';

//change this check if there s products using this genre

type Response = Result<undefined, UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError>;

export class DeleteGenreUseCase implements UseCase<DeleteGenreRequestDto, Response> {
  constructor(
    private productRepo: ProductRepoI,
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

      await this.genreCommandsRepo.deleteGenre(genreId);
      await this.productRepo.deleteProductsGenre(genreId);

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
