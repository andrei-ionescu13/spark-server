import { Request, Response } from 'express';
import { GetOrderUseCase } from './getOrderUseCase';
import { Controller } from '../../../../controller';
import { UseCaseErrors } from '../../../../appError';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  orderNumber: z.string(),
});

export type GetOrderRequestDto = z.infer<typeof schema>;

export class GetOrderController extends Controller {
  constructor(private useCase: GetOrderUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      orderNumber: req.params.orderNumber,
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
