import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { DeletePublisherErrors } from '../deletePublisher/deletePublisherUseCase';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  ids: z.array(z.uuidv7()),
});

export type DeletePublishersBulkRequestDto = z.infer<typeof schema>;

export class DeletePublishersBulkController extends Controller {
  constructor(private useCase: DeletePublishersBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      ids: req.body.ids,
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
          case DeletePublisherErrors.PublisherIsUsed:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

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
