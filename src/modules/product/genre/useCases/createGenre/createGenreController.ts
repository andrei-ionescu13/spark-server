import { Request, Response } from 'express';
import * as z from 'zod';
import { UseCaseErrors } from '../../../../../appError';
import { Controller } from '../../../../../controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { CreateGenreErrors, CreateGenreUseCase } from './createGenreUseCase';

const schema = z.object({
  name: z.string().min(3),
  slug: z.string().optional(),
});

export type CreateGenreRequestDto = z.infer<typeof schema>;

export class CreateGenreController extends Controller {
  constructor(private useCase: CreateGenreUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      name: req.body.name,
      slug: req.body.slug,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateGenreErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateGenreErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          case CreateGenreErrors.ValidationError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const genre = result.value;
      return this.ok(res, genre);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
