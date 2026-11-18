import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { UpdateNamespaceUseCase } from './updateNamespaceUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  namespaceId: z.uuidv7(),
  name: z.string(),
});

export type UpdateNamespaceRequestDto = z.infer<typeof schema>;

export class UpdateNamespaceController extends Controller {
  constructor(private useCase: UpdateNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      namespaceId: req.params.namespaceId,
      name: req.body.name,
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
          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const name = result.value;
      return this.ok(res, name);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
