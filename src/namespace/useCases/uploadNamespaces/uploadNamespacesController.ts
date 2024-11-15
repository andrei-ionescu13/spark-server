import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UploadNamespacesRequestDto } from './uploadNamespacesRequestDto';
import { UploadNamespacesUseCase } from './uploadNamespacesUseCase';

export class UploadNamespacesController extends BaseController {
  constructor(private useCase: UploadNamespacesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UploadNamespacesRequestDto = {}

    try {
      const result = await this.useCase.execute(dto);

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
  }
}