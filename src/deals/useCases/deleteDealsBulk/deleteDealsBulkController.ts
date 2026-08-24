import { Request, Response } from 'express';
import { DeleteDealsBulkRequestDto } from './deleteDealsBulkRequestDto';
import { DeleteDealsBulkUseCase } from './deleteDealsBulkUseCase';
import { Controller } from '../../../Controller';

export class DeleteDealsBulkController extends Controller {
  constructor(private useCase: DeleteDealsBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDealsBulkRequestDto = {
      ids: req.body.ids,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

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
