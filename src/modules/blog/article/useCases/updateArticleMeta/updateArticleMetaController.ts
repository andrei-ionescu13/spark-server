import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdateArticleMetaErrors, UpdateArticleMetaUseCase } from './updateArticleMetaUseCase';

const schema = z.object({
  articleId: z.string(),
  title: z.string().min(1).max(120),
  description: z.string().min(1).max(1024),
  keywords: z.array(z.string().min(1)).min(1),
});

export type UpdateArticleMetaRequestDto = z.infer<typeof schema>;

export class UpdateArticleMetaController extends Controller {
  constructor(private useCase: UpdateArticleMetaUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({ ...req.body, articleId: req.params.articleId });

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

          case UpdateArticleMetaErrors.ArchivedArticleError:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const meta = result.value;
      return this.ok(res, meta);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
