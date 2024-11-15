import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteDealsBulkRequestDto } from './deleteDealsBulkRequestDto';
import { DeleteDealsBulkUseCase } from './deleteDealsBulkUseCase';

export class DeleteDealsBulkController extends BaseController {
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
