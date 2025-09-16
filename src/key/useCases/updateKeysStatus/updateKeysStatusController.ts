import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { UpdateKeysStatusRequestDto } from './updateKeysStatusRequestDto';
import { UpdateKeysStatusUseCase } from './updateKeysStatusUseCase';

export class UpdateKeysStatusController extends Controller {
  constructor(private useCase: UpdateKeysStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      keyId: z.string(),
      status: z.enum(['secret', 'revealed', 'reported']),
    });

    const result = schema.safeParse({ keyId: req.params.keyId, status: req.body.status });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateKeysStatusRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.NotFound:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const status = result.value;
      return this.ok(res, { status });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
