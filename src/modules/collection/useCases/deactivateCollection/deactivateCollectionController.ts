import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { DeactivateCollectionUseCase } from './deactivateCollectionUseCase';
import { zodRequestValidationError } from '../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  collectionId: z.uuidv7(),
});

export type DeactivateCollectionRequestDto = z.infer<typeof schema>;

export class DeactivateCollectionController extends Controller {
  constructor(private useCase: DeactivateCollectionUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      collectionId: req.params.collectionId,
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

      const collection = result.value;
      return this.ok(res, collection);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
