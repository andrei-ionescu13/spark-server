import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteDeveloperBulkRequestDto } from './deleteDeveloperBulkRequestDto';
import {
  DeleteDeveloperBulkErrors,
  DeleteDeveloperBulkUseCase,
} from './deleteDeveloperBulkUseCase';

export class DeleteDeveloperBulkController extends BaseController {
  constructor(private useCase: DeleteDeveloperBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDeveloperBulkRequestDto = {
      ids: req.body.ids,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteDeveloperBulkErrors.DeveloperInUse:
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
