import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteArticleCategoryBulkRequestDto } from './deleteArticleCategoryBulkRequestDto';
import {
  DeleteArticleCategoryBulkErrors,
  DeleteArticleCategoryBulkUseCase,
} from './deleteArticleCategoryBulkUseCase';

export class DeleteArticleCategoryBulkController extends BaseController {
  constructor(private useCase: DeleteArticleCategoryBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticleCategoryBulkRequestDto = {
      ids: req.body.ids,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteArticleCategoryBulkErrors.ArticleCategoryInUse:
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
