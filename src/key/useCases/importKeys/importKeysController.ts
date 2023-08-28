import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ImportKeysRequestDto } from './importKeysRequestDto';
import { ImportKeysErrors, ImportKeysUseCase } from './importKeysUseCase';
import { AppError } from '../../../AppError';

export class ImportKeysController extends BaseController {
  constructor(private useCase: ImportKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ImportKeysRequestDto = {
      keysFile: req.file as Express.Multer.File,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ImportKeysErrors.KeyForPlatformExists:
            return this.forbidden(res, error.getErrorValue().message);

          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
