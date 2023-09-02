import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateOperatingSystemRequestDto } from './updateOperatingSystemRequestDto';
import { UpdateOperatingSystemUseCase } from './updateOperatingSystemUseCase';
import { AppError } from '../../../AppError';

export class UpdateOperatingSystemController extends BaseController {
  constructor(private useCase: UpdateOperatingSystemUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateOperatingSystemRequestDto = {
      operatingSystemId: req.params.operatingSystemId,
      name: req.body.name,
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

      const operatingSystem = result.value.getValue();

      return this.ok(res, operatingSystem);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
