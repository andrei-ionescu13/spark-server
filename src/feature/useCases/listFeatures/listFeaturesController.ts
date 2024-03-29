import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListFeaturesRequestDto } from './listFeaturesRequestDto';
import { ListFeaturesUseCase } from './listFeaturesUseCase';

export class ListFeaturesController extends BaseController {
  constructor(private useCase: ListFeaturesUseCase) {
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

      const features = result.value.getValue();

      return this.ok(res, features);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
