import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { UpdateOperatingSystemRequestDto } from './updateOperatingSystemRequestDto';
import {
  UpdateOperatingSystemErrors,
  UpdateOperatingSystemUseCase,
} from './updateOperatingSystemUseCase';

export class UpdateOperatingSystemController extends Controller {
  constructor(private useCase: UpdateOperatingSystemUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateOperatingSystemRequestDto = {
      operatingSystemId: req.params.operatingSystemId,
      name: body.name,
      slug: body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UpdateOperatingSystemErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case UpdateOperatingSystemErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const operatingSystem = result.value;
      return this.ok(res, { name: operatingSystem.name });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
