import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { DeleteArticleCategoryBulkRequestDto } from './deleteArticleCategoryBulkRequestDto';
import {
  DeleteArticleCategoryBulkErrors,
  DeleteArticleCategoryBulkUseCase,
} from './deleteArticleCategoryBulkUseCase';

export class DeleteArticleCategoryBulkController extends Controller {
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

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case DeleteArticleCategoryBulkErrors.ArticleCategoryInUse:
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
