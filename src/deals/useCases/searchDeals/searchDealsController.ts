import { Request, Response } from 'express';
import { SearchDealsRequestDto } from './searchDealsRequestDto';
import { SearchDealsUseCase } from './searchDealsUseCase';
import { Controller } from '../../../Controller';

export class SearchDealsController extends Controller {
  constructor(private useCase: SearchDealsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const dto: SearchDealsRequestDto = {
      keyword: query.keyword as string,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as string,
      status: query.status as string,
      page: query?.page ? Number.parseInt(query.page as string) : undefined,
      limit: query?.limit ? Number.parseInt(query.limit as string) : undefined,
    };

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
