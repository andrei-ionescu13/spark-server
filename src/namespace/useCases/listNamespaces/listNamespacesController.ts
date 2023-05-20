import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListNamespacesUseCase } from './listNamespacesUseCase';

export class ListNamespacesController extends BaseController {
  constructor(private useCase: ListNamespacesUseCase) {
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

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
