import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import {
  UpdateArticleCategoryErrors,
  UpdateArticleCategoryUseCase,
} from './updateArticleCategoryUseCase';

const schema = z.object({
  articleId: z.uuidv7(),
  category: z.uuidv7(),
});

export type UpdateArticleCategoryRequestDto = z.infer<typeof schema>;

export class UpdateArticleCategoryController extends Controller {
  constructor(private useCase: UpdateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      articleId: req.params.articleId,
      category: req.body.category,
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

          case UpdateArticleCategoryErrors.ArchivedArticleError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const category = result._value;

      return this.ok(res, { category });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
