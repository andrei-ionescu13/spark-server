import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../src/AppError';
import { Controller } from '../../../src/Controller';
import { GetUserRequestDto } from './getUserRequestDto';
import { GetUserUseCase } from './getUserUseCase';

export class GetUserController extends Controller {
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
          case UseCaseErrors.NotFound:
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
