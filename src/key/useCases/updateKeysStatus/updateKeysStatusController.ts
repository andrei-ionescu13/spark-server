import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateKeysStatusRequestDto } from './updateKeysStatusRequestDto';
import { UpdateKeysStatusErrors, UpdateKeysStatusUseCase } from './updateKeysStatusUseCase';
import { AppError } from '../../../AppError';

export class UpdateKeysStatusController extends BaseController {
  constructor(private useCase: UpdateKeysStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateKeysStatusRequestDto = {
      keyId: req.params.keyId,
      status: req.body.status,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case UpdateKeysStatusErrors.SecretKeyError:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      const status = result.value.getValue();

      return this.ok(res, { status });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
