import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateFeatureRequestDto } from './updateFeatureRequestDto';
import { UpdateFeatureErrors, UpdateFeatureUseCase } from './updateFeatureUseCase';
import { AppError } from '../../../AppError';

export class UpdateFeatureController extends BaseController {
  constructor(private useCase: UpdateFeatureUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateFeatureRequestDto = {
      featureId: req.params.featureId,
      name: body.name,
      slug: body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateFeatureErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case UpdateFeatureErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const feature = result.value.getValue();

      return this.ok(res, { name: feature.name });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
