import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../Controller';
import { zodRequestValidationError } from '../../../zodErrors';
import { SearchKeysRequestDto } from './searchKeysRequestDto';
import { SearchKeysUseCase } from './searchKeysUseCase';

export class SearchKeysController extends Controller {
  constructor(private useCase: SearchKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const input = {
      keyword: query.keyword,
      status: query.status,
      page: query?.page,
      limit: query?.limit,
    };

    const schema = z.object({
      keyword: z.string().optional(),
      status: z.enum(['secret', 'revealed', 'reported']).optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: SearchKeysRequestDto = result.data;

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
