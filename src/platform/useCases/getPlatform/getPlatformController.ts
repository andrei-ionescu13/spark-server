import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetPlatformRequestDto } from './getPlatformRequestDto';
import { GetPlatformUseCase } from './getPlatformUseCase';
import { AppError } from '../../../AppError';

export class GetPlatformController extends BaseController {
  constructor(private useCase: GetPlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetPlatformRequestDto = { platformId: req.params.platformId };

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
