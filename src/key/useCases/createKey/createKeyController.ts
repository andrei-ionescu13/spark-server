import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { CreateKeyRequestDto } from './createKeyRequestDto';
import { CreateKeyErrors, CreateKeyUseCase } from './createKeyUseCase';
import { AppError } from '../../../AppError';

export class CreateKeyController extends BaseController {
  constructor(private useCase: CreateKeyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateKeyRequestDto = {
      productId: req.body.productId,
      value: req.body.key,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case CreateKeyErrors.KeyForPlatformExists:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const id = result.value.getValue();

      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
