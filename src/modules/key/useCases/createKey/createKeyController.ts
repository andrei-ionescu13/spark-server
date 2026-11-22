import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { CreateKeyErrors, CreateKeyUseCase } from './createKeyUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  productId: z.uuidv7(),
  value: z.string(),
});

export type CreateKeyRequestDto = z.infer<typeof schema>;

export class CreateKeyController extends Controller {
  constructor(private useCase: CreateKeyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({ productId: req.body.productId, value: req.body.key });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateKeyErrors.KeyForPlatformExists:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const id = result.value;
      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
