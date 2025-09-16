import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { DeleteArticleTagBulkRequestDto } from './deleteArticleTagBulkRequestDto';
import {
  DeleteArticleTagBulkErrors,
  DeleteArticleTagBulkUseCase,
} from './deleteArticleTagBulkUseCase';

export class DeleteArticleTagBulkController extends Controller {
  constructor(private useCase: DeleteArticleTagBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticleTagBulkRequestDto = {
      ids: req.body.ids,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

        switch (error.constructor) {
          case DeleteArticleTagBulkErrors.ArticleTagInUse:
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
