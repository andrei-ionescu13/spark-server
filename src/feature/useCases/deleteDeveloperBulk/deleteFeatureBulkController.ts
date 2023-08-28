import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteFeatureBulkRequestDto } from './deleteFeatureBulkRequestDto';
import { DeleteFeatureBulkErrors, DeleteFeatureBulkUseCase } from './deleteFeatureBulkUseCase';

export class DeleteFeatureBulkController extends BaseController {
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case DeleteFeatureBulkErrors.FeatureInUse:
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
