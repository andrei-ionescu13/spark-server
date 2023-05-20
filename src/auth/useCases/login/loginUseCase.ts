import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { AuthService } from '../../../services/authService';
import { UseCase } from '../../../use-case';
import { AdminRepoI } from '../../adminRepo';
import { TokenRepoI } from '../../tokenRepo';
import { LoginRequestDto } from './loginRequestDto';
import bcrypt from 'bcrypt';

export namespace LoginErrors {
  export class WrongCredentials extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Wrong username or password' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class LoginUseCase implements UseCase<LoginRequestDto, Response> {
  constructor(
    private adminRepo: AdminRepoI,
    private tokeRepo: TokenRepoI,
    private authService: AuthService,
  ) {}

  execute = async (request: LoginRequestDto): Promise<Response> => {
    const { username, password } = request;

    try {
      const admin = await this.adminRepo.findByUsername(username);
      const found = !!admin;

      if (!found) {
        return left(new LoginErrors.WrongCredentials());
      }

      const valid = await bcrypt.compare(password, admin.password);

      if (!valid) {
        return left(new LoginErrors.WrongCredentials());
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

      return right(Result.ok<any>({ accessToken, refreshToken }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
