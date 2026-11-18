import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { CreateTranslationErrors, CreateTranslationUseCase } from './createTranslationUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z
  .object({
    namespaceId: z.uuidv7(),
    key: z.string(),
  })
  .catchall(z.string());

export type CreateTranslationRequestDto = z.infer<typeof schema>;

export class CreateTranslationController extends Controller {
  constructor(private useCase: CreateTranslationUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      ...req.body,
      namespaceId: req.params.namespaceId,
      key: req.body.key,
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
          case CreateTranslationErrors.KeyIsUserError:
            return this.conflict(res, error.message);

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
