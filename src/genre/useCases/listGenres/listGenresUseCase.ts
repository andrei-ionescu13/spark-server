import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { GenreRepoI } from '../../genreRepo';
import { ListGenresRequestDto } from './listGenresRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class ListGenresUseCase implements UseCase<undefined, Response> {
  constructor(private genreRepo: GenreRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const genres = await this.genreRepo.listGenres();

      return right(Result.ok<any>(genres));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
