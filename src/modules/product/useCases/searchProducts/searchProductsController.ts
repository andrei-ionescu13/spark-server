import { Request, Response } from 'express';
import { Controller } from '../../../../controller';
import { SearchProductsUseCase } from './searchProductsUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  keyword: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchProductsRequestDto = z.infer<typeof schema>;

export class SearchProductsController extends Controller {
  constructor(private useCase: SearchProductsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const result = schema.safeParse({
      keyword: query.keyword,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: query.status,
      page: query.page,
      limit: query.limit,
    });

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto = result.data;

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
