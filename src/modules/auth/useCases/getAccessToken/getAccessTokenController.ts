import { Request, Response } from 'express';
import { Controller } from '../../../../controller';
import { GetAccessTokenErrors, GetAccessTokenUseCase } from './getAccessTokenUseCase';
import { UseCaseErrors } from '../../../../appError';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  refreshToken: z.string(),
});

export type GetAccessTokenRequestDto = z.infer<typeof schema>;

export class GetAccessTokenController extends Controller {
  constructor(private useCase: GetAccessTokenUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const validation = schema.safeParse({
      refreshToken: req.cookies.refreshToken,
    });

    if (validation.error) {
      return this.forbidden(res, zodRequestValidationError(validation.error).message);
    }

    const dto = validation.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

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
      res.cookie('accessToken', accessToken, {
        maxAge: 24 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });
      return this.ok(res, accessToken);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
