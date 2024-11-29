import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateNamespaceRequestDto } from './createNamespaceRequestDto';
import { CreateNamespaceErrors, CreateNamespaceUseCase } from './createNamespaceUseCase';

export class CreateNamespaceController extends BaseController {
  constructor(private useCase: CreateNamespaceUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateNamespaceRequestDto = {
      name: req.body.name,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateNamespaceErrors.NameNotAvailable:
            return this.forbidden(res, error.getErrorValue().message);

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
