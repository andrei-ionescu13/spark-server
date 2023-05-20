import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { GenreRepoI } from '../../genreRepo';
import { UpdateGenreRequestDto } from './updateGenreRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateGenreUseCase implements UseCase<UpdateGenreRequestDto, Response> {
  constructor(private genreRepo: GenreRepoI) {}

  execute = async (request: UpdateGenreRequestDto): Promise<Response> => {
    const { genreId, ...rest } = request;
    const props = rest;

    try {
      const genre = await this.genreRepo.getGenre(genreId);

      if (!genre) {
        return left(new AppError.NotFound('Genre not found'));
      }

      const updatedGenre = await this.genreRepo.updateGenre(genreId, props);

      return right(Result.ok<any>(updatedGenre));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
