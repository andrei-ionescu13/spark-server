import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetAccessTokenRequestDto } from './getAccessTokenRequestDto';
import { GetAccessTokenErrors, GetAccessTokenUseCase } from './getAccessTokenUseCase';

export class GetAccessTokenController extends BaseController {
  constructor(private useCase: GetAccessTokenUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetAccessTokenRequestDto = {
      refreshToken: req.cookies.refreshToken,
    };

    try {
      console.log(dto);
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case GetAccessTokenErrors.RefreshTokenRequiredError:
            return this.forbidden(res, error.getErrorValue().message);

          case GetAccessTokenErrors.RefreshTokenInvalidError:
            return this.unauthorized(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const accessToken = result.value.getValue();
      res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 1000, httpOnly: true });
      return this.ok(res, accessToken);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
