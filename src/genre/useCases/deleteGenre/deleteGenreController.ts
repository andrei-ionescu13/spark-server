import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteGenreRequestDto } from './deleteGenreRequestDto';
import { DeleteGenreUseCase } from './deleteGenreUseCase';

export class DeleteGenreController extends BaseController {
  constructor(private useCase: DeleteGenreUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteGenreRequestDto = { genreId: req.params.genreId };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
