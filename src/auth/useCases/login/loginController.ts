import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { LoginRequestDto } from './loginRequestDto';
import { LoginErrors, LoginUseCase } from './loginUseCase';

export class LoginController extends Controller {
  constructor(private useCase: LoginUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    console.log('dasdasd');
    const schema = z.object({
      username: z.string(),
      password: z.string(),
    });

    const result = schema.safeParse({ password: req.body.password, username: req.body.username });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: LoginRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case LoginErrors.WrongCredentials:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const { accessToken, refreshToken } = result.value;

      res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 1000, httpOnly: true });
      res.cookie('refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 1000, httpOnly: true });

      return this.ok(res, { accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
