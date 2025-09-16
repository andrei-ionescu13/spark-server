import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { DeleteArticlesBulkRequestDto } from './deleteArticlesBulkRequestDto';
import { DeleteArticlesBulkUseCase } from './deleteArticlesBulkUseCase';

export class DeleteArticlesBulkController extends Controller {
  constructor(private useCase: DeleteArticlesBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteArticlesBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const { error } = result;

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
