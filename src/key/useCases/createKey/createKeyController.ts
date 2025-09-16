import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { CreateKeyRequestDto } from './createKeyRequestDto';
import { CreateKeyErrors, CreateKeyUseCase } from './createKeyUseCase';

export class CreateKeyController extends Controller {
  constructor(private useCase: CreateKeyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: CreateKeyRequestDto = {
      productId: req.body.productId,
      value: req.body.key,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case CreateKeyErrors.KeyForPlatformExists:
            return this.forbidden(res, error.message);

          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const id = result.value;
      return this.ok(res, { id });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
