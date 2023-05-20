import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AddGenreRequestDto } from './addGenreRequestDto';
import { AddGenreUseCase } from './addGenreUseCase';

export class AddGenreController extends BaseController {
  constructor(private useCase: AddGenreUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: AddGenreRequestDto = {
      name: req.body.name,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const genre = result.value.getValue();

      return this.ok(res, { genre });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
