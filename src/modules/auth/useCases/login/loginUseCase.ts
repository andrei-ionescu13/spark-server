import { UseCaseErrors } from '../../../../appError';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { UseCaseError } from '../../../../useCaseError';
import { LoginRequestDto } from './loginRequestDto';
import { AdminQueriesRepoI } from '../../repo/admin/queries';
import { AdminCommandsRepoI } from '../../repo/admin/commands';
import { TokenCommandsRepoI } from '../../repo/token/commands';
import { Token } from '../../domain/token';
import { AuthService } from '../../authService';
import bcrypt from 'bcrypt';

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
      const admin = await this.adminCommandsRepo.getAdminByUsername(username);
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
        admin: admin._id,
        value: refreshToken,
        expiresAt,
        type: 'refresh-token',
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
