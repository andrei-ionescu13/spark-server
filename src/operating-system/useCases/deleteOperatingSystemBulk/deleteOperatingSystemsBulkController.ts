import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteOperatingSystemsBulkRequestDto } from './deleteOperatingSystemsBulkRequestDto';
import { DeleteOperatingSystemsBulkUseCase } from './deleteOperatingSystemsBulkUseCase';

export class DeleteOperatingSystemsBulkController extends BaseController {
  constructor(private useCase: DeleteOperatingSystemsBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteOperatingSystemsBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res, result);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
