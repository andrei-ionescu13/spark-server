import bcrypt from 'bcrypt';
import { UseCaseErrors } from '../../../AppError';
import { AuthService } from '../../../authService';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { AdminRepoI } from '../../adminRepo';
import { TokenRepoI } from '../../tokenRepo';
import { LoginRequestDto } from './loginRequestDto';

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
    private adminRepo: AdminRepoI,
    private tokeRepo: TokenRepoI,
    private authService: AuthService,
  ) {}

  execute = async (request: LoginRequestDto): Promise<Response> => {
    const { username, password } = request;

    try {
      const admin = await this.adminRepo.getAdminByUsername(username);

      if (!admin) {
        return Result.fail(new LoginErrors.WrongCredentials());
      }

      const valid = await bcrypt.compare(password, admin.password);

      if (!valid) {
        return Result.fail(new LoginErrors.WrongCredentials());
      }

      const accessToken = this.authService.generateAccessToken(admin);
      const refreshToken = this.authService.generateRefreshToken(admin);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await this.tokeRepo.createToken({
        admin: admin.id,
        token: refreshToken,
        expiresAt,
        type: 'refresh-token',
      });

      return Result.ok({ accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
