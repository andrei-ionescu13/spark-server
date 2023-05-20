import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { GenreRepoI } from '../../genreRepo';
import { SearchGenresRequestDto } from './searchGenresRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchGenresUseCase implements UseCase<SearchGenresRequestDto, Response> {
  constructor(private genreRepo: GenreRepoI) {}

  execute = async (request: SearchGenresRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      console.log(query);
      const genres = await this.genreRepo.searchGenres(query);
      const count = await this.genreRepo.getGenresCount(query);

      return right(Result.ok<any>({ genres, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
