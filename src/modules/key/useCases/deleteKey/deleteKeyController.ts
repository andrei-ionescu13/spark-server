import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { DeleteKeyUseCase } from './deleteKeyUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  keyId: z.uuidv7(),
});

export type DeleteKeyRequestDto = z.infer<typeof schema>;

export class DeleteKeyController extends Controller {
  constructor(private useCase: DeleteKeyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({ keyId: req.params.keyId });

    if (result.error) {
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

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
