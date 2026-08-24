import bcrypt from 'bcrypt';
import { UseCaseErrors } from '../../../AppError';
import { AuthService } from '../../../authService';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { LoginRequestDto } from './loginRequestDto';
import { AdminQueriesRepoI } from '../../repo/admin/queries';
import { AdminCommandsRepoI } from '../../repo/admin/commands';
import { TokenCommandsRepoI } from '../../repo/token/commands';
import { Token } from '../../token';
import { v7 as uuid7 } from 'uuid';

export namespace LoginErrors {
  export class WrongCredentials extends UseCaseError {
    constructor() {
      super('Wrong username or password');
    }
  }
}

type Response = Result<
  { accessToken: string; refreshToken: string },
  UseCaseErrors.UnexpectedError
>;

export class LoginUseCase implements UseCase<LoginRequestDto, Response> {
  constructor(
    private adminCommandsRepo: AdminCommandsRepoI,
    private tokenCommandsRepo: TokenCommandsRepoI,
    private authService: AuthService,
  ) {}

  execute = async (request: LoginRequestDto): Promise<Response> => {
    const { username, password } = request;

    try {
      const adminOrError = await this.adminCommandsRepo.getAdminByUsername(username);
      if (adminOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(adminOrError.error.message));

      const admin = adminOrError.value;
      if (!admin) {
        return Result.fail(new LoginErrors.WrongCredentials());
      }

      const valid = await bcrypt.compare(password, admin.passwordHash);

      if (!valid) {
        return Result.fail(new LoginErrors.WrongCredentials());
      }

      const accessToken = this.authService.generateAccessToken(admin._id, admin.username.value);
      const refreshToken = this.authService.generateRefreshToken(admin._id, admin.username.value);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      const tokenOrError = Token.create({
        _id: uuid7(),
        admin: admin._id,
        value: refreshToken,
        expiresAt,
        type: 'refresh-token',
        createdAt: new Date(),
      });
      if (tokenOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(tokenOrError.error.message));

      const token = tokenOrError.value;
      if (!token) {
        return Result.fail(new LoginErrors.WrongCredentials());
      }

      await this.tokenCommandsRepo.save(token);
      return Result.ok({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
