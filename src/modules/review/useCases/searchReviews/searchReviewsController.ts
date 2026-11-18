import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { SearchReviewsUseCase } from './searchReviewsUseCase';

const schema = z.object({
  keyword: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['published', 'unpublished', 'flagged']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type SearchReviewsRequestDto = z.infer<typeof schema>;

export class SearchReviewsController extends Controller {
  constructor(private useCase: SearchReviewsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse(req.query);

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
