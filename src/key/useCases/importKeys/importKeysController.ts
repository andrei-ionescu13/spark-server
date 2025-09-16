import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { ImportKeysRequestDto } from './importKeysRequestDto';
import { ImportKeysErrors, ImportKeysUseCase } from './importKeysUseCase';

export class ImportKeysController extends Controller {
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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case ImportKeysErrors.KeyForPlatformExists:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

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
