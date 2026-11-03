import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeleteArticleCategoryRequestDto } from './deleteArticleCategoryRequestDto';
import {
  DeleteArticleCategoryErrors,
  DeleteArticleCategoryUseCase,
} from './deleteArticleCategoryUseCase';

export class DeleteArticleCategoryController extends Controller {
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

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case DeleteArticleCategoryErrors.ArticleCategoryInUse:
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
