import { Request, Response } from 'express';
import { Controller } from '../../../../controller';
import { SearchProductReviewsUseCase } from './searchProductReviewsUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  productId: z.uuidv7(),
  keyword: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchProductReviewsRequestDto = z.infer<typeof schema>;

export class SearchProductReviewsController extends Controller {
  constructor(private useCase: SearchProductReviewsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const result = schema.safeParse({
      productId: req.params.productId,
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
