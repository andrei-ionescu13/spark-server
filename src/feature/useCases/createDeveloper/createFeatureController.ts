import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateFeatureRequestDto } from './createFeatureRequestDto';
import { CreateFeatureErrors, CreateFeatureUseCase } from './createFeatureUseCase';

export class CreateFeatureController extends BaseController {
  constructor(private useCase: CreateFeatureUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateFeatureRequestDto = {
      name: req.body.name,
      slug: req.body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateFeatureErrors.NameNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          case CreateFeatureErrors.SlugNotAvailableError:
            return this.forbidden(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const featureName = result.value.getValue();

      return this.ok(res, { name: featureName });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
