import { Request, Response } from 'express';
import { GetUserRequestDto } from './getUserRequestDto';
import { GetUserUseCase } from './getUserUseCase';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';

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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const user = result.value;
      return this.ok(res, user);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
