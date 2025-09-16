import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { UpdateArticleStatusRequestDto } from './updateArticleStatusRequestDto';
import { UpdateArticleStatusUseCase } from './updateArticleStatusUseCase';

export class UpdateArticleStatusController extends Controller {
  constructor(private useCase: UpdateArticleStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      articleId: z.string(),
      status: z.enum(['draft', 'published', 'archived']),
    });

    const result = schema.safeParse({ articleId: req.params.articleId, status: req.body.status });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: UpdateArticleStatusRequestDto = result.data;

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
