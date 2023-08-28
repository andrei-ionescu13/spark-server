import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteArticleCategoryRequestDto } from './deleteArticleCategoryRequestDto';
import {
  DeleteArticleCategoryErrors,
  DeleteArticleCategoryUseCase,
} from './deleteArticleCategoryUseCase';
import { AppError } from '../../../AppError';

export class DeleteArticleCategoryController extends BaseController {
  constructor(private useCase: DeleteArticleCategoryUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticleCategoryRequestDto = {
      articleCategoryId: req.params.articleCategoryId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          case DeleteArticleCategoryErrors.ArticleCategoryInUse:
            return this.forbidden(res, error.getErrorValue().message);

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
