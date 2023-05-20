import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeletePlatformRequestDto } from './deletePlatformRequestDto';
import { DeletePlatformUseCase } from './deletePlatformUseCase';
import { AppError } from '../../../AppError';

export class DeletePlatformController extends BaseController {
  constructor(private useCase: DeletePlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePlatformRequestDto = { platformId: req.params.platformId };

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
