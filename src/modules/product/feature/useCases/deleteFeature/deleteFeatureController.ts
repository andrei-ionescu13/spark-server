import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeleteFeatureErrors, DeleteFeatureUseCase } from './deleteFeatureUseCase';
import { DeleteFeatureRequestDto } from './deleteFeaturerRequestDto';

export class DeleteFeatureController extends Controller {
  constructor(private useCase: DeleteFeatureUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteFeatureRequestDto = {
      featureId: req.params.featureId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeleteFeatureErrors.FeatureInUse:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
