import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteArticlesBulkRequestDto } from './deleteArticlesBulkRequestDto';
import { DeleteArticlesBulkUseCase } from './deleteArticlesBulkUseCase';

export class DeleteArticlesBulkController extends BaseController {
  constructor(private useCase: DeleteArticlesBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticlesBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value.getErrorValue();

        switch (error.constructor) {
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
