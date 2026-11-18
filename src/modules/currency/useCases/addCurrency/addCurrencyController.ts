import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../appError';
import { Controller } from '../../../../controller';
import { AddCurrencyErrors, AddCurrencyUseCase } from './addCurrencyUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  name: z.string(),
  code: z.string().length(3),
  symbol: z.string(),
});

export type AddCurrencyRequestDto = z.infer<typeof schema>;

export class AddCurrencyController extends Controller {
  constructor(private useCase: AddCurrencyUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const result = schema.safeParse({
      name: body.name,
      code: body.code,
      symbol: body.symbol,
    });

    if (result.error) {
      console.log(result.error);
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

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
