import { Request, Response } from 'express';
import { Controller } from '../../../../Controller';
import { ListNamespacesUseCase } from './listNamespacesUseCase';

export class ListNamespacesController extends Controller {
  constructor(private useCase: ListNamespacesUseCase) {
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

      const namespaces = result.value;
      return this.ok(res, namespaces);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
