import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { PlatformRepoI } from '../../platformRepo';
import { SearchPlatformsRequestDto } from './searchPlatformsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchPlatformsUseCase implements UseCase<SearchPlatformsRequestDto, Response> {
  constructor(private platformRepo: PlatformRepoI) {}

  execute = async (request: SearchPlatformsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const platforms = await this.platformRepo.searchPlatforms(query);
      const count = await this.platformRepo.getPlatformsCount(query);

      return right(Result.ok<any>({ platforms, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
