import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { DeleteCollectionUseCase } from './deleteCollectionUseCase';
import { zodRequestValidationError } from '../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  collectionId: z.uuidv7(),
});

export type DeleteCollectionRequestDto = z.infer<typeof schema>;

export class DeleteCollectionController extends Controller {
  constructor(private useCase: DeleteCollectionUseCase) {
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
