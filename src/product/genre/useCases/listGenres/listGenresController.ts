import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { ListGenresUseCase } from './listGenresUseCase';

export class ListGenresController extends Controller {
  constructor(private useCase: ListGenresUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    try {
      const result = await this.useCase.execute();

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const genres = result.value;
      return this.ok(res, genres);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
