import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { RegisterRequestDto } from './registerRequestDto';
import { RegisterErrors, RegisterUseCase } from './registerUseCase';

export class RegisterController extends BaseController {
  constructor(private useCase: RegisterUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: RegisterRequestDto = {
      password: req.body.password,
      username: req.body.username,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case RegisterErrors.UsernameTakenError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const adminId = result.value.getValue();

      return this.ok(res, adminId);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
