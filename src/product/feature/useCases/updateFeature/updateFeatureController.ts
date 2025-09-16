import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { UpdateFeatureRequestDto } from './updateFeatureRequestDto';
import { UpdateFeatureErrors, UpdateFeatureUseCase } from './updateFeatureUseCase';

export class UpdateFeatureController extends Controller {
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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UpdateFeatureErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case UpdateFeatureErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const feature = result.value;
      return this.ok(res, { name: feature.name });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
