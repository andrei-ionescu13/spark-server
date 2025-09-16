import { Request, Response } from 'express';
import * as z from 'zod';
import { Controller } from '../../../../Controller';
import { zodRequestValidationError } from '../../../../zodErrors';
import { SearchTranslationsRequestDto } from './searchTranslationsRequestDto';
import { SearchTranslationsUseCase } from './searchTranslationsUseCase';

export class SearchTranslationsController extends Controller {
  constructor(private useCase: SearchTranslationsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const input = {
      namespaceId: req.params.namespaceId,
      keyword: query?.keyword,
      sortBy: query?.sortBy,
      sortOrder: query?.sortOrder,
      page: query?.page,
      limit: query?.limit,
      languageCodes: query?.languageCodes,
    };

    const schema = z.object({
      namespaceId: z.string(),
      keyword: z.string().optional(),
      sortBy: z.string().optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      page: z.coerce.number().int().positive().optional(),
      limit: z.coerce.number().int().positive().optional(),
      languageCodes: z.preprocess((val) => {
        if (val === undefined) return undefined;
        if (typeof val === 'string') return [val];
        if (Array.isArray(val)) return val;
        return undefined;
      }, z.array(z.string().min(2).max(2)).optional()),
    });

    const result = schema.safeParse(input);

    if (result.error) {
      return this.forbidden(res, zodRequestValidationError(result.error).message);
    }

    const dto: SearchTranslationsRequestDto = result.data;

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
