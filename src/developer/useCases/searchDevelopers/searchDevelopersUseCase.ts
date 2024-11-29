import { AppError } from '../../../AppError';
import { Either, left, Result, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DeveloperRepoI } from '../../developerRepo';
import { SearchArticleCategoriesRequestDto } from './searchDevelopersRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchArticleCategoriesUseCase
  implements UseCase<SearchArticleCategoriesRequestDto, Response>
{
  constructor(private developerRepo: DeveloperRepoI) {}

  execute = async (request: SearchArticleCategoriesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const developers = await this.developerRepo.searchDevelopers(request);
      const count = await this.developerRepo.getDevelopersCount(request);

      return right(Result.ok<any>({ developers, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
