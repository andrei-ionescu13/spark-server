import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteFeatureRequestDto } from './deleteFeatureRequestDto';
import { DeleteFeatureErrors, DeleteFeatureUseCase } from './deleteFeatureUseCase';

export class DeleteFeatureController extends BaseController {
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteFeatureErrors.FeatureInUse:
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
