import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdatePlatformRequestDto } from './updatePlatformRequestDto';
import { UpdatePlatformUseCase } from './updatePlatformUseCase';
import { AppError } from '../../../AppError';

export class UpdatePlatformController extends BaseController {
  constructor(private useCase: UpdatePlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdatePlatformRequestDto = {
      platformId: req.params.platformId,
      name: req.body.name,
      logoFile: req.file as Express.Multer.File,
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

      const platform = result.value.getValue();

      return this.ok(res, platform);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
