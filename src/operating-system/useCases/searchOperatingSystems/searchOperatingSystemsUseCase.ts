import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { OperatingSystemRepoI } from '../../operatingSystemRepo';
import { SearchOperatingSystemsRequestDto } from './searchOperatingSystemsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchOperatingSystemsUseCase
  implements UseCase<SearchOperatingSystemsRequestDto, Response>
{
  constructor(private operatingSystemRepo: OperatingSystemRepoI) {}

  execute = async (request: SearchOperatingSystemsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const operatingSystemsAndCount = await this.operatingSystemRepo.searchOperatingSystems(query);

      return right(Result.ok<any>(operatingSystemsAndCount));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
