import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeletePlatformErrors } from '../deletePlatform/deletePlatformUseCase';
import { DeletePlatformsBulkRequestDto } from './deletePlatformsBulkRequestDto';
import { DeletePlatformsBulkUseCase } from './deletePlatformsBulkUseCase';

export class DeletePlatformsBulkController extends Controller {
  constructor(private useCase: DeletePlatformsBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePlatformsBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeletePlatformErrors.PlatformIsUsed:
            return this.forbidden(res, error.message);

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
