import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListOperatingSystemsUseCase } from './listOperatingSystemsUseCase';

export class ListOperatingSystemsController extends BaseController {
  constructor(private useCase: ListOperatingSystemsUseCase) {
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

      const operatingSystems = result.value.getValue();

      return this.ok(res, operatingSystems);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
