import { Request, Response } from 'express';
import * as z from 'zod';
import { GetUserUseCase } from './getUserUseCase';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  userId: z.uuidv7(),
});

export type GetUserRequestDto = z.infer<typeof schema>;

export class GetUserController extends Controller {
  constructor(private useCase: GetUserUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      userId: req.params.userId,
    });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const user = result.value;
      return this.ok(res, user);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
