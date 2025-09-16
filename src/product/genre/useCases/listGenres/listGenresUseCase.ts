import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { GenreDto } from '../../genreMapper';
import { GenreQueriesRepoI } from '../../repo/queries';
import { ListGenresRequestDto } from './listGenresRequestDto';

type Response = Result<GenreDto[], UseCaseErrors.UnexpectedError>;

export class ListGenresUseCase implements UseCase<ListGenresRequestDto, Response> {
  constructor(private genreQueriesRepo: GenreQueriesRepoI) {}

  execute = async (): Promise<Response> => {
    try {
      const genres = await this.genreQueriesRepo.listGenres();
      return Result.ok(genres);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
