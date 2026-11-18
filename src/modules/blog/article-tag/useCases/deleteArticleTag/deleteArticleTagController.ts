import { Request, Response } from 'express';
import { Controller } from '../../../../../controller';
import { DeleteArticleTagErrors, DeleteArticleTagUseCase } from './deleteArticleTagUseCase';
import { zodRequestValidationError } from '../../../../../zodErrors';
import * as z from 'zod';

const schema = z.object({ articleTagId: z.uuidv7() });

export type DeleteArticleTagRequestDto = z.infer<typeof schema>;

export class DeleteArticleTagController extends Controller {
  constructor(private useCase: DeleteArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      articleTagId: req.params.articleTagId,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case DeleteArticleTagErrors.ArticleTagInUse:
            return this.forbidden(res, error.message);

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
