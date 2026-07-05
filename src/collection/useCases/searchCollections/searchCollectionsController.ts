import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { SearchCollectionsRequestDto } from './searchCollectionsRequestDto';
import { SearchCollectionsUseCase } from './searchCollectionsUseCase';

export class SearchCollectionsController extends Controller {
  constructor(private useCase: SearchCollectionsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const schema = z.object({
      keyword: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
      status: z.enum(['expired', 'active', 'scheduled']),
    });

    const result = schema.safeParse(query);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: SearchCollectionsRequestDto = result.data;

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

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
