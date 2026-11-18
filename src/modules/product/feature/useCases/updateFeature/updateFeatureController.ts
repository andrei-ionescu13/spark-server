import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { UpdateFeatureErrors, UpdateFeatureUseCase } from './updateFeatureUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../../zodErrors';

const schema = z.object({
  featureId: z.uuidv7(),
  name: z.string(),
  slug: z.string(),
});

export type UpdateFeatureRequestDto = z.infer<typeof schema>;

export class UpdateFeatureController extends Controller {
  constructor(private useCase: UpdateFeatureUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;

    const result = schema.safeParse({
      featureId: req.params.featureId,
      name: body.name,
      slug: body.slug,
    });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;
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
