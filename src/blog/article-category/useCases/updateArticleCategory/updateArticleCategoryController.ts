import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateArticleCategoryErrors } from '../createArticleCategory/createArticleCategoryUseCase';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';
import { UpdateArticleCategoryUseCase } from './updateArticleCategoryUseCase';

export class UpdateArticleCategoryController extends Controller {
  constructor(private useCase: UpdateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      articleCategoryId: z.string(),
      name: z.string(),
      slug: z.string(),
    });

    const result = schema.safeParse({
      ...req.body,
      articleTagId: req.params.articleTagId,
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
          case CreateArticleCategoryErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateArticleCategoryErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const articleCategory = result._value;

      return this.ok(res, articleCategory);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
