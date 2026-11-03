import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { GetAccessTokenRequestDto } from './getAccessTokenRequestDto';
import { GetAccessTokenErrors, GetAccessTokenUseCase } from './getAccessTokenUseCase';
import { UseCaseErrors } from '../../../../AppError';

export class GetAccessTokenController extends Controller {
  constructor(private useCase: GetAccessTokenUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetAccessTokenRequestDto = {
      refreshToken: req.cookies.refreshToken,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case GetAccessTokenErrors.RefreshTokenRequiredError:
            return this.forbidden(res, error.message);

          case GetAccessTokenErrors.RefreshTokenInvalidError:
            return this.unauthorized(res, error.message);

          case GetAccessTokenErrors.RefreshTokenExpiredError:
            return this.unauthorized(res, error.message);

          case UseCaseErrors.NotFound:
            return this.unauthorized(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const accessToken = result.value;
      res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 1000, httpOnly: true });
      return this.ok(res, accessToken);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
