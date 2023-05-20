import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetUserRequestDto } from './getUserRequestDto';
import { GetUserUseCase } from './getUserUseCase';
import { AppError } from '../../../AppError';

export class GetUserController extends BaseController {
  constructor(private useCase: GetUserUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetUserRequestDto = {
      userId: req.params.userId,
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

      const value = result.value.getValue();
      console.log(value);
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
