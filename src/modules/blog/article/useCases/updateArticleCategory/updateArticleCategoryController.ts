import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';
import {
  UpdateArticleCategoryErrors,
  UpdateArticleCategoryUseCase,
} from './updateArticleCategoryUseCase';

export class UpdateArticleCategoryController extends Controller {
  constructor(private useCase: UpdateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      articleId: z.string(),
      category: z.string(),
    });

    const result = schema.safeParse({
      articleId: req.params.articleId,
      category: req.body.category,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateArticleCategoryRequestDto = result.data;

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
