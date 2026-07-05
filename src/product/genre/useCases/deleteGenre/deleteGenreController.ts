import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { DeleteGenreErrors, DeleteGenreUseCase } from './deleteGenreUseCase';
import { DeleteGenreRequestDto } from './deleteGenrerRequestDto';

export class DeleteGenreController extends Controller {
  constructor(private useCase: DeleteGenreUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteGenreRequestDto = {
      genreId: req.params.genreId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeleteGenreErrors.GenreIsUsed:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
