import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { GenreRepoI } from '../../genreRepo';
import { DeleteGenreRequestDto } from './deleteGenreRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteGenreUseCase implements UseCase<DeleteGenreRequestDto, Response> {
  constructor(private genreRepo: GenreRepoI, private productRepo: ProductRepoI) {}

  execute = async (request: DeleteGenreRequestDto): Promise<Response> => {
    const { genreId } = request;

    try {
      const genre = await this.genreRepo.getGenre(genreId);

      if (!genre) {
        return left(new AppError.NotFound('Genre not found'));
      }

      await this.genreRepo.deleteGenre(genreId);
      await this.productRepo.deleteProductsGenre(genreId);

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
