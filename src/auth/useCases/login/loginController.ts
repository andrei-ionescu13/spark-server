import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { LoginRequestDto } from './loginRequestDto';
import { LoginErrors, LoginUseCase } from './loginUseCase';

export class LoginController extends BaseController {
  constructor(private useCase: LoginUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: LoginRequestDto = {
      password: req.body.password,
      username: req.body.username,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case LoginErrors.WrongCredentials:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const { accessToken, refreshToken } = result.value.getValue();

      res.cookie('accessToken', accessToken, { maxAge: 24 * 60 * 1000, httpOnly: true });
      res.cookie('refreshToken', refreshToken, { maxAge: 7 * 24 * 60 * 1000, httpOnly: true });
      return this.ok(res, { accessToken, refreshToken });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
