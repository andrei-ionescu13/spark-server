import { Request, Response } from 'express';
import { GetOrderRequestDto } from './getOrderRequestDto';
import { GetOrderUseCase } from './getOrderUseCase';
import { Controller } from '../../../Controller';
import { UseCaseErrors } from '../../../AppError';

export class GetOrderController extends Controller {
  constructor(private useCase: GetOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetOrderRequestDto = {
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

      const order = result.value;
      return this.ok(res, order);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
