import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { KeyDto } from '../../keyMapper';
import { KeyQueriesRepoI } from '../../repo/queries';
import { SearchKeysRequestDto } from './searchKeysRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<
  {
    keys: KeyDto[];
    count: number;
  },
  UseCaseErrors.UnexpectedError
>;

export class SearchKeysUseCase implements UseCase<SearchKeysRequestDto, Response> {
  constructor(private keyQueriesRepo: KeyQueriesRepoI) {}

  execute = async (request: SearchKeysRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.keyQueriesRepo.searchKeys(query);

      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
