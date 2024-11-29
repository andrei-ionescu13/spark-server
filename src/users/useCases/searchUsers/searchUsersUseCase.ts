import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../userRepo';
import { SearchUsersRequestDto } from './searchUsersRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

const MAX_LIMIT = 36;
const LIMIT = 10;

export class SearchUsersUseCase implements UseCase<SearchUsersRequestDto, Response> {
  constructor(private userRepo: UserRepoI) {}

  execute = async (request: SearchUsersRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const users = await this.userRepo.searchUsers(query);
      const count = await this.userRepo.getUsersCount(query);

      return right(Result.ok<any>({ users, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
