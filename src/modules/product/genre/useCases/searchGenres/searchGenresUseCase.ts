import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { GenreDto } from '../../genreMapper';
import { GenreQueriesRepoI } from '../../repo/queries';
import { SearchGenresRequestDto } from './searchGenresRequestDto';

type Response = Result<{ genres: GenreDto[]; count: number }, UseCaseErrors.UnexpectedError>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchGenresUseCase implements UseCase<SearchGenresRequestDto, Response> {
  constructor(private genreQueriesRepo: GenreQueriesRepoI) {}

  execute = async (request: SearchGenresRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const { genres, count } = await this.genreQueriesRepo.searchGenres(query);
      return Result.ok({ genres, count });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
