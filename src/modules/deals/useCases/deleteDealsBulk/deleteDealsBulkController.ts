import { Request, Response } from 'express';
import { DeleteDealsBulkUseCase } from './deleteDealsBulkUseCase';
import { Controller } from '../../../../controller';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  ids: z.array(z.uuidv7()),
});

export type DeleteDealsBulkRequestDto = z.infer<typeof schema>;

export class DeleteDealsBulkController extends Controller {
  constructor(private useCase: DeleteDealsBulkUseCase) {
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
