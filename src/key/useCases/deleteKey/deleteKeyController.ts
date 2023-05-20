import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteKeyRequestDto } from './deleteKeyRequestDto';
import { DeleteKeyUseCase } from './deleteKeyUseCase';
import { AppError } from '../../../AppError';

export class DeleteKeyController extends BaseController {
  constructor(private useCase: DeleteKeyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteKeyRequestDto = {
      keyId: req.params.keyId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
