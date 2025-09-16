import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { DeletePlatformRequestDto } from './deletePlatformRequestDto';
import { DeletePlatformErrors, DeletePlatformUseCase } from './deletePlatformUseCase';

export class DeletePlatformController extends Controller {
  constructor(private useCase: DeletePlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeletePlatformRequestDto = {
      platformId: req.params.platformId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case DeletePlatformErrors.PlatformIsUsed:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

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
