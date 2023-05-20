import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AppError } from '../../../AppError';
import { UpdateArticleCategoryRequestDto } from './updateArticleCategoryRequestDto';
import {
  UpdateArticleCategoryUseCase,
  UpdateArticleCategoryErrors,
} from './updateArticleCategoryUseCase';

export class UpdateArticleCategoryController extends BaseController {
  constructor(private useCase: UpdateArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateArticleCategoryRequestDto = {
      articleId: req.params.articleId,
      category: req.body.category,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          case UpdateArticleCategoryErrors.ArchivedArticleError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const category = result.value.getValue();

      return this.ok(res, { category });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
