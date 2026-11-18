import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { UpdateTranslationUseCase } from './updateTranslationUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z
  .object({
    namespaceId: z.uuidv7(),
    keyValue: z.string(),
    key: z.string(),
  })
  .catchall(z.string());

export type UpdateTranslationRequestDto = z.infer<typeof schema>;

export class UpdateTranslationController extends Controller {
  constructor(private useCase: UpdateTranslationUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      ...req.body,
      keyValue: req.body.key,
      namespaceId: req.params.namespaceId,
      key: req.params.key,
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

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const namespaceId = result.value;
      return this.ok(res, namespaceId);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
