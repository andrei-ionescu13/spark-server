import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { SearchOperatingSystemsRequestDto } from './searchOperatingSystemsRequestDto';
import { SearchOperatingSystemsUseCase } from './searchOperatingSystemsUseCase';

export class SearchOperatingSystemsController extends BaseController {
  constructor(private useCase: SearchOperatingSystemsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const dto: SearchOperatingSystemsRequestDto = {
      keyword: query.keyword as string,
      limit: query.limit ? Number.parseInt(query.limit as string) : undefined,
      page: query.page ? Number.parseInt(query.page as string) : undefined,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as string,
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
      console.log(value);
      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
