import { Request, Response } from 'express';
import { Controller } from '../../../Controller';
import { RegisterRequestDto } from './registerRequestDto';
import { RegisterErrors, RegisterUseCase } from './registerUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../zodErrors';

export class RegisterController extends Controller {
  constructor(private useCase: RegisterUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      username: z.string().min(6),
      password: z.string().min(12),
    });

    const result = schema.safeParse({ password: req.body.password, username: req.body.username });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: RegisterRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case RegisterErrors.UsernameTakenError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const adminId = result.value;

      return this.ok(res, adminId);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
