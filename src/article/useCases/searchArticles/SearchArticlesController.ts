import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { SearchArticlesRequestDto } from './SearchArticlesRequestDto';
import { SearchArticlesUseCase } from './SearchArticlesUseCase';

export class SearchArticlesController extends BaseController {
  constructor(private useCase: SearchArticlesUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const dto: SearchArticlesRequestDto = {
      keyword: query?.keyword as string,
      sortBy: query?.sortBy as string,
      sortOrder: query?.sortOrder as string,
      status: query?.status as string,
      category: query?.category as string,
      page: query?.page ? Number.parseInt(query.page as string) : undefined,
      limit: query?.limit ? Number.parseInt(query.limit as string) : undefined,
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
