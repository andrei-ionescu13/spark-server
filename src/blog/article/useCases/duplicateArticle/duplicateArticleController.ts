import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { DuplicateArticleRequestDto } from './duplicateArticleRequestDto';
import { DuplicateArticleErrors, DuplicateArticleUseCase } from './duplicateArticleUseCase';

export class DuplicateArticleController extends Controller {
  constructor(private useCase: DuplicateArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      articleId: z.string(),
      slug: z.string(),
      title: z.string().min(12).max(120),
    });

    const result = schema.safeParse({
      ...req.body,
      articleId: req.params.articleId,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: DuplicateArticleRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case DuplicateArticleErrors.TitleNotAvailableError:
            return this.forbidden(res, error.message);

          case DuplicateArticleErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error.message);
        }
      }

      const id = result._value;

      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
