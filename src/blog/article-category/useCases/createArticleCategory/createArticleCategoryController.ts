import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { CreateArticleCategoryRequestDto } from './createArticleCategoryRequestDto';
import {
  CreateArticleCategoryErrors,
  CreateArticleCategoryUseCase,
} from './createArticleCategoryUseCase';

export class CreateArticleCategoryController extends Controller {
  constructor(private useCase: CreateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string(),
      slug: z.string().optional(),
    });

    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateArticleCategoryRequestDto = result.data;

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

      const articleCategoryName = result._value;

      return this.ok(res, { name: articleCategoryName });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
