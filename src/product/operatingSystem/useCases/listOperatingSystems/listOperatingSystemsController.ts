import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { ListOperatingSystemsUseCase } from './listOperatingSystemsUseCase';

export class ListOperatingSystemsController extends Controller {
  constructor(private useCase: ListOperatingSystemsUseCase) {
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

      const operatingSystems = result.value;
      return this.ok(res, operatingSystems);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
