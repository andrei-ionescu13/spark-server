import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { AddCurrencyRequestDto } from './addCurrencyRequestDto';
import { AddCurrencyUseCase } from './addCurrencyUseCase';

export class AddCurrencyController extends BaseController {
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const currency = result.value.getValue();

      return this.ok(res, currency);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
