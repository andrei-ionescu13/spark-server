import { Request, Response } from 'express';
import { SearchOrdersRequestDto } from './searchOrdersRequestDto';
import { SearchOrdersUseCase } from './searchOrdersUseCase';
import { Controller } from '../../../../Controller';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';
import { paramToArray } from '../../../../paramToArray';

export class SearchOrdersController extends Controller {
  constructor(private useCase: SearchOrdersUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const schema = z.object({
      keyword: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      status: z.array(z.enum(['open', 'archived', 'canceled'])).optional(),
      paymentStatus: z
        .array(z.enum(['authorized', 'paid', 'pending', 'refunded', 'expired']))
        .optional(),
      fulfillmentStatus: z
        .array(z.enum(['fulfilled', 'unfulfilled', 'partially fulfilled']))
        .optional(),
      page: z.coerce.number().optional(),
      limit: z.coerce.number().max(36),
    });

    const validation = schema.safeParse({
      keyword: query.keyword,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      status: paramToArray(query.status),
      paymentStatus: paramToArray(query.paymentStatus),
      fulfillmentStatus: paramToArray(query.fulfillmentStatus),
      page: query.page,
      limit: query.limit,
    });

    if (validation.error) {
      return this.forbidden(res, zodRequestValidationError(validation.error).message);
    }

    const dto: SearchOrdersRequestDto = validation.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.value;

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
