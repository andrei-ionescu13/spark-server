import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { CreateNamespaceErrors, CreateNamespaceUseCase } from './createNamespaceUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z.object({
  name: z.string(),
});

export type CreateNamespaceRequestDto = z.infer<typeof schema>;

export class CreateNamespaceController extends Controller {
  constructor(private useCase: CreateNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
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
          case CreateNamespaceErrors.NameNotAvailable:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const namespace = result.value;
      return this.ok(res, namespace);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
