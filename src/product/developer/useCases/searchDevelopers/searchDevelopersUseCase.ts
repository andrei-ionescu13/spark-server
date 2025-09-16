import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../use-case';
import { DeveloperDto } from '../../developerMapper';
import { DeveloperQueriesRepoI } from '../../repo/queries';
import { SearchDevelopersRequestDto } from './searchDevelopersRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<
  { developers: DeveloperDto[]; count: number },
  UseCaseErrors.UnexpectedError
>;

export class SearchDevelopersUseCase implements UseCase<SearchDevelopersRequestDto, Response> {
  constructor(private developerQueriesRepo: DeveloperQueriesRepoI) {}

  execute = async (request: SearchDevelopersRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.developerQueriesRepo.searchDevelopers(query);
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
