import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { GetPlatformRequestDto } from './getPlatformRequestDto';
import { GetPlatformUseCase } from './getPlatformUseCase';

export class GetPlatformController extends Controller {
  constructor(private useCase: GetPlatformUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetPlatformRequestDto = { platformId: req.params.platformId };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const platform = result.value;
      return this.ok(res, platform);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
