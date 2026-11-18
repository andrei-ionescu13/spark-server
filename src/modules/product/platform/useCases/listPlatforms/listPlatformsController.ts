import { Request, Response } from 'express';
import { Controller } from '../../../../../controller';
import { ListPlatformsUseCase } from './listPlatformsUseCase';

export class ListPlatformsController extends Controller {
  constructor(private useCase: ListPlatformsUseCase) {
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

      const platforms = result.value;
      return this.ok(res, platforms);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
