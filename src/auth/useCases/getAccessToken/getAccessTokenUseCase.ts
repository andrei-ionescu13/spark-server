import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCaseError } from '../../../UseCaseError';
import { AuthService } from '../../../services/authService';
import { UseCase } from '../../../use-case';
import { AdminRepoI } from '../../adminRepo';
import { TokenRepoI } from '../../tokenRepo';
import { GetAccessTokenRequestDto } from './getAccessTokenRequestDto';

export namespace GetAccessTokenErrors {
  export class RefreshTokenRequiredError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Refresh token required' });
    }
  }

  export class RefreshTokenInvalidError extends Result<UseCaseError> {
    constructor() {
      super(false, { message: 'Invalid refresh token' });
    }
  }
}

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class GetAccessTokenUseCase implements UseCase<GetAccessTokenRequestDto, Response> {
  constructor(
    private adminRepo: AdminRepoI,
    private tokeRepo: TokenRepoI,
    private authService: AuthService,
  ) {}

  execute = async (request: GetAccessTokenRequestDto): Promise<Response> => {
    const { refreshToken } = request;
    console.log(refreshToken);
    try {
      if (!refreshToken) {
        return left(new GetAccessTokenErrors.RefreshTokenRequiredError());
      }

      const { adminId } = await this.authService.decodeRefreshToken(refreshToken);
      const refreshTokenDoc = await this.tokeRepo.findOne(refreshToken, adminId);

      if (!refreshTokenDoc || refreshTokenDoc.expiresAt.getTime < Date.now()) {
        return left(new GetAccessTokenErrors.RefreshTokenRequiredError());
      }

      const admin = await this.adminRepo.getAdmin(adminId);
      const accessToken = this.authService.generateAccessToken(admin);

      return right(Result.ok<any>(accessToken));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
