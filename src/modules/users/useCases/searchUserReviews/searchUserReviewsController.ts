import { Request, Response } from 'express';
import { SearchUserReviewsUseCase } from './searchUserReviewsUseCase';
import { Controller } from '../../../../controller';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  userId: z.uuidv7(),
  keyword: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  status: z.enum(['published', 'unpublished', 'flagged']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type SearchUserReviewsRequestDto = z.infer<typeof schema>;

export class SearchUserReviewsController extends Controller {
  constructor(private useCase: SearchUserReviewsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const result = schema.safeParse({
      userId: req.params.userId,
      keyword: query.keyword,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: query.status,
      page: query.page,
      limit: query.limit,
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
