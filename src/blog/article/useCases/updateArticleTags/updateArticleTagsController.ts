import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { UpdateArticleTagsRequestDto } from './updateArticleTagsRequestDto';
import { UpdateArticleTagsErrors, UpdateArticleTagsUseCase } from './updateArticleTagsUseCase';

export class UpdateArticleTagsController extends Controller {
  constructor(private useCase: UpdateArticleTagsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      articleId: z.string(),
      tags: z.array(z.string().min(3)).min(1),
    });

    const result = schema.safeParse({ articleId: req.params.articleId, tags: req.body.tags });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateArticleTagsRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UpdateArticleTagsErrors.ArchivedArticleError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const tags = result.value;

      return this.ok(res, { tags });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
