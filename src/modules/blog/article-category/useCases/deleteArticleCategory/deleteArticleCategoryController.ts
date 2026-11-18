import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import {
  DeleteArticleCategoryErrors,
  DeleteArticleCategoryUseCase,
} from './deleteArticleCategoryUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({
  articleCategoryId: z.string(),
});

export type DeleteArticleCategoryRequestDto = z.infer<typeof schema>;

export class DeleteArticleCategoryController extends Controller {
  constructor(private useCase: DeleteArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      articleCategoryId: req.params.articleCategoryId,
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
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case DeleteArticleCategoryErrors.ArticleCategoryInUse:
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
