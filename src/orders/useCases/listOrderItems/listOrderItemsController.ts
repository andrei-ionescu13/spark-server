import { Request, Response } from 'express';
import { ListOrderItemsRequestDto } from './listOrderItemsRequestDto';
import { ListOrderItemsUseCase } from './listOrderItemsUseCase';
import { Controller } from '../../../Controller';
import { UseCaseErrors } from '../../../AppError';

export class ListOrderItemsController extends Controller {
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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const lineItems = result.value;
      return this.ok(res, lineItems);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
