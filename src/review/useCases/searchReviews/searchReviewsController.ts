import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { SearchReviewsRequestDto } from './searchReviewsRequestDto';
import { SearchReviewsUseCase } from './searchReviewsUseCase';

export class SearchReviewsController extends BaseController {
  constructor(private useCase: SearchReviewsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const dto: SearchReviewsRequestDto = {
      keyword: query.keyword as string,
      status: query.status as string,
      sortOrder: query.sortOrder as string,
      page: query.page ? Number.parseInt(query.page as string) : undefined,
      limit: query.limit ? Number.parseInt(query.limit as string) : undefined,
      sortBy: query.sortBy as string,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          default:
            return this.fail(res, error);
        }
      }

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
