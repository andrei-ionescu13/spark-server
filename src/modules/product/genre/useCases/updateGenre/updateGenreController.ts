import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { UpdateGenreRequestDto } from './updateGenreRequestDto';
import { UpdateGenreErrors, UpdateGenreUseCase } from './updateGenreUseCase';

export class UpdateGenreController extends Controller {
  constructor(private useCase: UpdateGenreUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateGenreRequestDto = {
      genreId: req.params.genreId,
      name: body.name,
      slug: body.slug,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UpdateGenreErrors.NameNotAvailableError:
            return this.forbidden(res, error.message);

          case UpdateGenreErrors.SlugNotAvailableError:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const genre = result.value;
      return this.ok(res, { name: genre.name });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
