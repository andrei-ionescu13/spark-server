import bcrypt from 'bcrypt';
import { UseCaseErrors } from '../../../../AppError';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../UseCaseError';
import { RegisterRequestDto } from './registerRequestDto';
import { AdminQueriesRepoI } from '../../repo/admin/queries';
import { AdminCommandsRepoI } from '../../repo/admin/commands';
import { Admin } from '../../admin';
import { v7 as uuid7 } from 'uuid';
import { AdminUsername } from '../../adminUsername';
import { Result } from '../../../../result';

export namespace RegisterErrors {
  export class UsernameTakenError extends UseCaseError {
    constructor() {
      super('Username taken');
    }
  }
}

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class RegisterUseCase implements UseCase<RegisterRequestDto, Response> {
  constructor(
    private adminCommandsRepo: AdminCommandsRepoI,
    private adminQueriesRepo: AdminQueriesRepoI,
  ) {}

  execute = async (request: RegisterRequestDto): Promise<Response> => {
    const { username: usernameReq, password } = request;

    try {
      const foundByUsername = await this.adminQueriesRepo.getAdminByUsername(usernameReq);

      if (foundByUsername) {
        return Result.fail(new RegisterErrors.UsernameTakenError());
      }

      const passwordHash = await bcrypt.hash(password, 10);
      console.log(passwordHash);
      const usernameOrError = AdminUsername.create(usernameReq);
      if (usernameOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(usernameOrError.error.message));

      const username = usernameOrError.value;

      const adminOrError = Admin.create({
        _id: uuid7(),
        username,
        passwordHash,
      });
      if (adminOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(adminOrError.error.message));

      const admin = adminOrError.value;
      await this.adminCommandsRepo.save(admin);

      return Result.ok(admin._id);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
