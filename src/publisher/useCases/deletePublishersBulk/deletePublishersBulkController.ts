import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeletePublishersBulkRequestDto } from './deletePublishersBulkRequestDto';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';

export class DeletePublishersBulkController extends BaseController {
  constructor(private useCase: DeletePublishersBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePublishersBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

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
