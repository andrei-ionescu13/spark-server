import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../src/AppError';
import { Controller } from '../../../src/Controller';
import { ImportProductKeysRequestDto } from './importProductKeysRequestDto';
import { ImportProductKeysErrors, ImportProductKeysUseCase } from './importProductKeysUseCase';

export class ImportProductKeysController extends Controller {
  constructor(private useCase: ImportProductKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ImportProductKeysRequestDto = {
      keysFile: req.file as Express.Multer.File,
      productId: req.params.productId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case ImportProductKeysErrors.KeyForPlatformExists:
            return this.forbidden(res, error.getErrorValue().message);

          case UseCaseErrors.NotFound:
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
