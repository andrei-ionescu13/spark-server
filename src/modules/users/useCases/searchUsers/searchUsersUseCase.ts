import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { UserQueriesRepoI } from '../../repo/queries';
import { UserDto } from '../../userMapper';
import { SearchUsersRequestDto } from './searchUsersRequestDto';

type Response = Result<{ users: UserDto[]; count: number }, UseCaseErrors.UnexpectedError>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchUsersUseCase implements UseCase<SearchUsersRequestDto, Response> {
  constructor(private userQueriesRepo: UserQueriesRepoI) {}

  execute = async (request: SearchUsersRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const result = await this.userQueriesRepo.searchUsers(query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
