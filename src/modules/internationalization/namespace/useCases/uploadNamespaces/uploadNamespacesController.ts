import { Request, Response } from 'express';
import { Controller } from '../../../../../controller';
import { UploadNamespacesUseCase } from './uploadNamespacesUseCase';

export class UploadNamespacesController extends Controller {
  constructor(private useCase: UploadNamespacesUseCase) {
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

      const value = result.value;
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
