import { UseCaseErrors } from '../../../AppError';
import { AuthService } from '../../../authService';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { AdminRepoI } from '../../adminRepo';
import { TokenRepoI } from '../../tokenRepo';
import { GetAccessTokenRequestDto } from './getAccessTokenRequestDto';

export namespace GetAccessTokenErrors {
  export class RefreshTokenRequiredError extends UseCaseError {
    constructor() {
      super('Refresh token required');
    }
  }

  export class RefreshTokenInvalidError extends UseCaseError {
    constructor() {
      super('Invalid refresh token');
    }
  }
}

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class GetAccessTokenUseCase implements UseCase<GetAccessTokenRequestDto, Response> {
  constructor(
    private adminRepo: AdminRepoI,
    private tokeRepo: TokenRepoI,
    private authService: AuthService,
  ) {}

  execute = async (request: GetAccessTokenRequestDto): Promise<Response> => {
    const { refreshToken } = request;

    try {
      if (!refreshToken) {
        return Result.fail(new GetAccessTokenErrors.RefreshTokenRequiredError());
      }

      const { adminId } = await this.authService.decodeRefreshToken(refreshToken);
      const refreshTokenDoc = await this.tokeRepo.findOne(refreshToken, adminId);

      if (!refreshTokenDoc || refreshTokenDoc.expiresAt.getTime < Date.now()) {
        return Result.fail(new GetAccessTokenErrors.RefreshTokenRequiredError());
      }

      const admin = await this.adminRepo.getAdmin(adminId);
      const accessToken = this.authService.generateAccessToken(admin);

      return Result.ok(accessToken);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
