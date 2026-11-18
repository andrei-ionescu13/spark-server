import { Request, Response } from 'express';
import { Controller } from '../../../../../controller';
import {
  DeleteArticleCategoryBulkErrors,
  DeleteArticleCategoryBulkUseCase,
} from './deleteArticleCategoryBulkUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  ids: z.array(z.uuidv7()),
});

export type DeleteArticleCategoryBulkRequestDto = z.infer<typeof schema>;

export class DeleteArticleCategoryBulkController extends Controller {
  constructor(private useCase: DeleteArticleCategoryBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      ids: req.body.ids,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case DeleteArticleCategoryBulkErrors.ArticleCategoryInUse:
            return this.forbidden(res, error.message);

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
