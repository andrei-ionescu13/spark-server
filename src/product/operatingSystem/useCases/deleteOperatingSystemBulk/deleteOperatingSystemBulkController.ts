import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { DeleteOperatingSystemBulkRequestDto } from './deleteOperatingSystemBulkRequestDto';
import { DeleteOperatingSystemBulkUseCase } from './deleteOperatingSystemrBulkUseCase';

export class DeleteOperatingSystemBulkController extends Controller {
  constructor(private useCase: DeleteOperatingSystemBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteOperatingSystemBulkRequestDto = {
      ids: req.body.ids,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

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
