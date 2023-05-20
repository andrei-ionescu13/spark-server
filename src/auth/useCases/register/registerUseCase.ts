import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { UseCase } from '../../../use-case';
import { AdminRepoI } from '../../adminRepo';
import { RegisterRequestDto } from './registerRequestDto';
import bcrypt from 'bcrypt';

export namespace RegisterErrors {
  export class UsernameTakenError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Username taken' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class RegisterUseCase implements UseCase<RegisterRequestDto, Response> {
  constructor(private adminRepo: AdminRepoI) {}

  execute = async (request: RegisterRequestDto): Promise<Response> => {
    const { username, password } = request;

    try {
      const foundByUsername = this.adminRepo.findByUsername(username);

      if (foundByUsername) {
        return left(new RegisterErrors.UsernameTakenError());
      }

      const hash = await bcrypt.hash(password, 10);
      const admin = await this.adminRepo.createAdmin({
        username,
        password: hash,
      });

      return right(Result.ok<any>(admin._id));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
