import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { GenreRepoI } from '../../genreRepo';
import { DeleteGenresBulkRequestDto } from './deleteGenresBulkRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeleteGenresBulkUseCase implements UseCase<DeleteGenresBulkRequestDto, Response> {
  constructor(private genreRepo: GenreRepoI, private productRepo: ProductRepoI) {}

  deleteGenre = async (genreId) => {
    const genre = await this.genreRepo.getGenre(genreId);

    if (!genre) {
      return left(new AppError.NotFound('Genre not found'));
    }

    await this.genreRepo.deleteGenre(genreId);
    await this.productRepo.deleteProductsGenre(genreId);
  };

  execute = async (request: DeleteGenresBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((genreId) => this.deleteGenre(genreId)));
      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
