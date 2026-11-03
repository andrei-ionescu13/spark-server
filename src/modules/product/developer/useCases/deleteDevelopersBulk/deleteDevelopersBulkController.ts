import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeleteDeveloperErrors } from '../deleteDeveloper/deleteDeveloperUseCase';
import { DeleteDevelopersBulkRequestDto } from './deleteDevelopersBulkRequestDto';
import { DeleteDevelopersBulkUseCase } from './deleteDevelopersBulkUseCase';

export class DeleteDevelopersBulkController extends Controller {
  constructor(private useCase: DeleteDevelopersBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDevelopersBulkRequestDto = { ids: req.body.ids };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeleteDeveloperErrors.DeveloperIsUsed:
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
