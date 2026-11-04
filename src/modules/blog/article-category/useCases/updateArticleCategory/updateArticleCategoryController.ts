import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../../controllers';
import { zodRequestValidationError } from '../../../../../zodErrors';
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
      articleCategoryId: z.uuidv7(),
      name: z.string(),
      slug: z.string(),
    });

    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
      articleCategoryId: req.params.articleCategoryId,
    });

    if (result.error) {
      console.log(result.error);
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
