import { UseCaseErrors } from '../../../../../AppError';
import { Result } from '../../../../../Result';
import { UseCase } from '../../../../../useCase';
import { OperatingSystemDto } from '../../operatingSystemMapper';
import { OperatingSystemQueriesRepoI } from '../../repo/queries';
import { SearchOperatingSystemsRequestDto } from './searchOperatingSystemsRequestDto';

type Response = Result<
  { operatingSystems: OperatingSystemDto[]; count: number },
  UseCaseErrors.UnexpectedError
>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchOperatingSystemsUseCase
  implements UseCase<SearchOperatingSystemsRequestDto, Response>
{
  constructor(private operatingSystemQueriesRepo: OperatingSystemQueriesRepoI) {}

  execute = async (request: SearchOperatingSystemsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const { operatingSystems, count } =
        await this.operatingSystemQueriesRepo.searchOperatingSystems(query);
      return Result.ok({ operatingSystems, count });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
