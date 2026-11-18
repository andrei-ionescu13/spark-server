import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { UpdateArticleStatusUseCase } from './updateArticleStatusUseCase';

const schema = z.object({
  articleId: z.string(),
  status: z.enum(['draft', 'published', 'archived']),
});

export type UpdateArticleStatusRequestDto = z.infer<typeof schema>;

export class UpdateArticleStatusController extends Controller {
  constructor(private useCase: UpdateArticleStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({ articleId: req.params.articleId, status: req.body.status });

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

          default:
            return this.fail(res, error);
        }
      }

      const status = result.value;
      return this.ok(res, { status });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
