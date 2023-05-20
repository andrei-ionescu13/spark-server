import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateArticleMetaRequestDto } from './updateArticleMetaRequestDto';
import { UpdateArticleMetaErrors, UpdateArticleMetaUseCase } from './updateArticleMetaUseCase';
import { AppError } from '../../../AppError';

export class UpdateArticleMetaController extends BaseController {
  constructor(private useCase: UpdateArticleMetaUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateArticleMetaRequestDto = {
      title: body.title,
      description: body.description,
      keywords: body.keywords,
      articleId: req.params.articleId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          case UpdateArticleMetaErrors.ArchivedArticleError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();
      console.log(value);
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
