import { Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetUserRequestDto } from './getUserRequestDto';
import { GetUserUseCase } from './getUserUseCase';

export class GetUserController extends BaseController {
  constructor(private useCase: GetUserUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: any, res: Response) => {
    const dto: GetUserRequestDto = {
      user: req.user,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
