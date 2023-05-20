import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { SearchOrdersRequestDto } from './searchOrdersRequestDto';
import { SearchOrdersUseCase } from './searchOrdersUseCase';

export class SearchOrdersController extends BaseController {
  constructor(private useCase: SearchOrdersUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const query = req.query;
    const dto: SearchOrdersRequestDto = {
      keyword: query.keyword as string,
      sortBy: query.sortBy as string,
      sortOrder: query.sortOrder as string,
      status: query.status ? (query.status as string).split(',') : undefined,
      fulfillmentStatus: query.fulfillmentStatus
        ? (query.fulfillmentStatus as string).split(',')
        : undefined,
      paymentStatus: query.paymentStatus ? (query.paymentStatus as string).split(',') : undefined,
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
