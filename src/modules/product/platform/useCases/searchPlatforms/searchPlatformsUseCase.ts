import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { PlatformDto } from '../../platformMapper';
import { PlatformQueriesRepoI } from '../../repo/queries';
import { SearchPlatformsRequestDto } from './searchPlatformsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ platforms: PlatformDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchPlatformsUseCase implements UseCase<SearchPlatformsRequestDto, Response> {
  constructor(private platformQueriesRepo: PlatformQueriesRepoI) {}

  execute = async (request: SearchPlatformsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.platformQueriesRepo.searchPlatforms(query);
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
