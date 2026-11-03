import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../../Controller';
import { zodRequestValidationError } from '../../../../../zodErrors';
import { SearchArticleCategoriesRequestDto } from './searchArticleCategoriesRequestDto';
import { SearchArticleCategoriesUseCase } from './searchArticleCategoriesUseCase';

export class SearchArticleCategoriesController extends Controller {
  constructor(private useCase: SearchArticleCategoriesUseCase) {
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

    const dto: SearchArticleCategoriesRequestDto = result.data;

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
