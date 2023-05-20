import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateGenreRequestDto } from './updateGenreRequestDto';
import { UpdateGenreUseCase } from './updateGenreUseCase';
import { AppError } from '../../../AppError';

export class UpdateGenreController extends BaseController {
  constructor(private useCase: UpdateGenreUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateGenreRequestDto = {
      genreId: req.params.genreId,
      name: req.body.name,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const genre = result.value.getValue();

      return this.ok(res, genre);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
