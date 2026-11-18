import { Request, Response } from 'express';
import { Controller } from '../../../../../controller';
import { DeleteArticleUseCase } from './deleteArticleUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z.object({
  articleId: z.string(),
});

export type DeleteArticleRequestDto = z.infer<typeof schema>;

export class DeleteArticleController extends Controller {
  constructor(private useCase: DeleteArticleUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({ articleId: req.params.articleId });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
