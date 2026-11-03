import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { CreateFeatureRequestDto } from './createFeatureRequestDto';
import { CreateFeatureErrors, CreateFeatureUseCase } from './createFeatureUseCase';

export class CreateFeatureController extends Controller {
  constructor(private useCase: CreateFeatureUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(3),
      slug: z.string().optional(),
    });

    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: CreateFeatureRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateFeatureErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateFeatureErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateFeatureErrors.ValidationError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const feature = result.value;
      return this.ok(res, feature);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
