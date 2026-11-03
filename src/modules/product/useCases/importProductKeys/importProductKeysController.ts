import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { ImportProductKeysRequestDto } from './importProductKeysRequestDto';
import { ImportProductKeysErrors, ImportProductKeysUseCase } from './importProductKeysUseCase';

export class ImportProductKeysController extends Controller {
  constructor(private useCase: ImportProductKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ImportProductKeysRequestDto = {
      file: req.file as Express.Multer.File,
      productId: req.params.productId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case ImportProductKeysErrors.KeyForPlatformExists:
            return this.forbidden(res, error.message);

          case UseCaseErrors.DomainValidation:
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
