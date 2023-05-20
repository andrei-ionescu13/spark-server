import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListGenresUseCase } from './listGenresUseCase';

export class ListGenresController extends BaseController {
  constructor(private useCase: ListGenresUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const genres = result.value.getValue();

      return this.ok(res, genres);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
