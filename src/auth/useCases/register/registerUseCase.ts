import bcrypt from 'bcrypt';
import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { AdminRepoI } from '../../adminRepo';
import { RegisterRequestDto } from './registerRequestDto';

export namespace RegisterErrors {
  export class UsernameTakenError extends UseCaseError {
    constructor() {
      super('Username taken');
    }
  }
}

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class RegisterUseCase implements UseCase<RegisterRequestDto, Response> {
  constructor(private adminRepo: AdminRepoI) {}

  execute = async (request: RegisterRequestDto): Promise<Response> => {
    const { username, password } = request;

    try {
      const foundByUsername = await this.adminRepo.getAdminByUsername(username);

      if (foundByUsername) {
        return Result.fail(new RegisterErrors.UsernameTakenError());
      }

      const hash = await bcrypt.hash(password, 10);
      const admin = await this.adminRepo.createAdmin({
        username,
        password: hash,
      });

      return Result.ok(admin.id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
