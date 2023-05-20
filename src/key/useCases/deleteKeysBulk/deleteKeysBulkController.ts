import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteKeysBulkRequestDto } from './deleteKeysBulkRequestDto';
import { DeleteKeysBulkUseCase } from './deleteKeysBulkUseCase';

export class DeleteKeysBulkController extends BaseController {
  constructor(private useCase: DeleteKeysBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteKeysBulkRequestDto = {
      keyIds: req.body.ids,
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
