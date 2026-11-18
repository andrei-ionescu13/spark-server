import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { DeleteNamespaceUseCase } from './deleteNamespaceUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z.object({
  namespaceId: z.uuidv7(),
});

export type DeleteNamespaceRequestDto = z.infer<typeof schema>;

export class DeleteNamespaceController extends Controller {
  constructor(private useCase: DeleteNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      namespaceId: req.params.namespaceId,
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

      const namespaceName = result.value;
      return this.ok(res, namespaceName);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
