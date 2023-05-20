import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { ListOrderItemsRequestDto } from './listOrderItemsRequestDto';
import { ListOrderItemsUseCase } from './listOrderItemsUseCase';
import { AppError } from '../../../AppError';

export class ListOrderItemsController extends BaseController {
  constructor(private useCase: ListOrderItemsUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: ListOrderItemsRequestDto = {
      orderNumber: req.params.orderNumber,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
            return this.notFound(res, error.getErrorValue().message);

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
