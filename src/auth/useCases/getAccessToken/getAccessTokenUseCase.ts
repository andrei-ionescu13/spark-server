import { UseCaseErrors } from '../../../AppError';
import { AuthService } from '../../../authService';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UseCaseError } from '../../../UseCaseError';
import { AdminQueriesRepoI } from '../../repo/admin/queries';
import { TokenCommandsRepoI } from '../../repo/token/commands';
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

  export class RefreshTokenExpiredError extends UseCaseError {
    constructor() {
      super('Expired refresh token');
    }
  }
}

type Response = Result<string, UseCaseErrors.UnexpectedError>;

export class GetAccessTokenUseCase implements UseCase<GetAccessTokenRequestDto, Response> {
  constructor(
    private adminQueriesRepo: AdminQueriesRepoI,
    private tokenCommandsRepo: TokenCommandsRepoI,
    private authService: AuthService,
  ) {}

  execute = async (request: GetAccessTokenRequestDto): Promise<Response> => {
    const { refreshToken: refreshTokenReq } = request;

    try {
      if (!refreshTokenReq) {
        return Result.fail(new GetAccessTokenErrors.RefreshTokenRequiredError());
      }

      const { adminId } = await this.authService.decodeRefreshToken(refreshTokenReq);
      const refreshTokenOrError = await this.tokenCommandsRepo.findOne(refreshTokenReq, adminId);
      if (refreshTokenOrError.isErr())
        return Result.fail(new UseCaseErrors.DomainValidation(refreshTokenOrError.error.message));

      const refreshToken = refreshTokenOrError.value;

      if (!refreshToken) {
        return Result.fail(new GetAccessTokenErrors.RefreshTokenRequiredError());
      }

      if (refreshToken.isExpired()) {
        return Result.fail(new GetAccessTokenErrors.RefreshTokenExpiredError());
      }

      const admin = await this.adminQueriesRepo.getAdmin(adminId);
      if (!admin) {
        return Result.fail(new UseCaseErrors.NotFound('Admin not found'));
      }

      const accessToken = this.authService.generateAccessToken(admin.id, admin.username);
      return Result.ok(accessToken);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
