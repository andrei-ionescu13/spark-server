import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateArticleTagsRequestDto } from './updateArticleTagsRequestDto';
import { UpdateArticleTagsErrors, UpdateArticleTagsUseCase } from './updateArticleTagsUseCase';
import { AppError } from '../../../AppError';

export class UpdateArticleTagsController extends BaseController {
  constructor(private useCase: UpdateArticleTagsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateArticleTagsRequestDto = {
      articleId: req.params.articleId,
      tags: req.body.tags,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          case UpdateArticleTagsErrors.ArchivedArticleError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const tags = result.value.getValue();

      return this.ok(res, { tags });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
