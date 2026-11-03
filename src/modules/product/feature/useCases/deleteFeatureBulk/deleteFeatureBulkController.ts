import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeleteFeatureBulkRequestDto } from './deleteFeatureBulkRequestDto';
import { DeleteFeatureBulkError, DeleteFeatureBulkUseCase } from './deleteFeaturerBulkUseCase';

export class DeleteFeatureBulkController extends Controller {
  constructor(private useCase: DeleteFeatureBulkUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteFeatureBulkRequestDto = {
      ids: req.body.ids,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeleteFeatureBulkError.FeatureIsUsed:
            return this.notFound(res, error.message);

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
