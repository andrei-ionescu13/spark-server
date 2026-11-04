import { Request, Response } from 'express';
import { SearchDealsRequestDto } from './searchDealsRequestDto';
import { SearchDealsUseCase } from './searchDealsUseCase';
import { Controller } from '../../../../controller';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

export class SearchDealsController extends Controller {
  constructor(private useCase: SearchDealsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const schema = z.object({
      keyword: z.string().optional(),
      status: z.enum(['expired', 'active', 'scheduled']).optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
    });

    const result = schema.safeParse(req.query);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: SearchDealsRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const value = result.value;
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
