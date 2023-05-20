import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../userRepo';
import { GetUserRequestDto } from './getUserRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetUserUseCase implements UseCase<GetUserRequestDto, Response> {
  constructor(private userRepo: UserRepoI) {}

  execute = async (request: GetUserRequestDto): Promise<Response> => {
    const { userId } = request;

    try {
      const user = await this.userRepo.getUser(userId);
      const found = !!user;

      if (!found) {
        return left(new AppError.NotFound('User not found'));
      }

      return right(Result.ok(user));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
