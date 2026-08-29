import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { UserQueriesRepoI } from '../../repo/queries';
import { UserDto } from '../../userMapper';
import { GetUserRequestDto } from './getUserRequestDto';

type Response = Result<UserDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetUserUseCase implements UseCase<GetUserRequestDto, Response> {
  constructor(private UserQueriesRepo: UserQueriesRepoI) {}

  execute = async (request: GetUserRequestDto): Promise<Response> => {
    const { userId } = request;

    try {
      const user = await this.UserQueriesRepo.getUser(userId);

      if (!user) {
        return Result.fail(new UseCaseErrors.NotFound('User not found'));
      }

      return Result.ok(user);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
