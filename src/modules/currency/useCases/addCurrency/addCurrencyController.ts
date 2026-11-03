import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { AddCurrencyRequestDto } from './addCurrencyRequestDto';
import { AddCurrencyErrors, AddCurrencyUseCase } from './addCurrencyUseCase';

export class AddCurrencyController extends Controller {
  constructor(private useCase: AddCurrencyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: AddCurrencyRequestDto = {
      name: body.name,
      code: body.code,
      symbol: body.symbol,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case AddCurrencyErrors.TitleNotAvailableError:
            return this.conflict(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const currency = result.value;
      return this.ok(res, currency);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
