import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateArticleTagRequestDto } from './updateArticleTagRequestDto';
import { UpdateArticleTagErrors, UpdateArticleTagUseCase } from './updateArticleTagUseCase';
import { AppError } from '../../../AppError';

export class UpdateArticleTagController extends BaseController {
  constructor(private useCase: UpdateArticleTagUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateArticleTagRequestDto = {
      articleTagId: req.params.articleTagId,
      name: body.name,
      slug: body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateArticleTagErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case UpdateArticleTagErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const articleTag = result.value.getValue();

      return this.ok(res, { name: articleTag.name });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
