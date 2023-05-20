import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteCurrencyRequestDto } from './deleteCurrencyRequestDto';
import { DeleteCurrencyUseCase } from './deleteCurrencyUseCase';
import { AppError } from '../../../AppError';

export class DeleteCurrencyController extends BaseController {
  constructor(private useCase: DeleteCurrencyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteCurrencyRequestDto = {
      currencyId: req.params.currencyId,
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

      return this.noContent(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
