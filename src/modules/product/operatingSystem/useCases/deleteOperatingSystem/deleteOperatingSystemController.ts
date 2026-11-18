import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z.object({
  operatingSystemId: z.uuidv7(),
});

export type DeleteOperatingSystemRequestDto = z.infer<typeof schema>;

export class DeleteOperatingSystemController extends Controller {
  constructor(private useCase: DeleteOperatingSystemUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      operatingSystemId: req.params.operatingSystemId,
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

      const id = result.value;
      return this.ok(res, id);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
