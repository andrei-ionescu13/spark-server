import { Request, Response } from 'express';
import { Controller } from '../../../../controller';
import { SearchProductKeysUseCase } from './searchProductKeysUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  productId: z.uuidv7(),
  keyword: z.string().optional(),
  status: z.string().optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

export type SearchProductKeysRequestDto = z.infer<typeof schema>;

export class SearchProductKeysController extends Controller {
  constructor(private useCase: SearchProductKeysUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const result = schema.safeParse({
      productId: req.params.productId,
      keyword: query.keyword as string,
      status: query.status as string,
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
