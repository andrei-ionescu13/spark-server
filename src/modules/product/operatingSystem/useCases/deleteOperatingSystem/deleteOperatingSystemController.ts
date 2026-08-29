import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../../AppError';
import { Controller } from '../../../../../Controller';
import { DeleteOperatingSystemUseCase } from './deleteOperatingSystemUseCase';
import { DeleteOperatingSystemRequestDto } from './deleteOperatingSystemrRequestDto';

export class DeleteOperatingSystemController extends Controller {
  constructor(private useCase: DeleteOperatingSystemUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteOperatingSystemRequestDto = {
      operatingSystemId: req.params.operatingSystemId,
    };

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

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
