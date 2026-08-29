import { Request, Response } from 'express';
import { Controller } from '../../../../../Controller';
import { ListFeaturesUseCase } from './listFeaturesUseCase';

export class ListFeaturesController extends Controller {
  constructor(private useCase: ListFeaturesUseCase) {
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

      const features = result.value;
      return this.ok(res, features);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
