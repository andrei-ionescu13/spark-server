import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { SearchCurrenciesRequestDto } from './searchCurrenciesRequestDto';
import { SearchCurrenciesUseCase } from './searchCurrenciesUseCase';

export class SearchCurrenciesController extends Controller {
  constructor(private useCase: SearchCurrenciesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      keyword: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
    });

    const result = schema.safeParse(req.query);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: SearchCurrenciesRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const searchResult = result.value;
      return this.ok(res, searchResult);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
