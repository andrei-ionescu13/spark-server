import { Request, Response } from 'express';
import { Controller } from '../../../../../Controller';
import { UploadNamespacesRequestDto } from './uploadNamespacesRequestDto';
import { UploadNamespacesUseCase } from './uploadNamespacesUseCase';

export class UploadNamespacesController extends Controller {
  constructor(private useCase: UploadNamespacesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UploadNamespacesRequestDto = {};

    try {
      const result = await this.useCase.execute(dto);

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
