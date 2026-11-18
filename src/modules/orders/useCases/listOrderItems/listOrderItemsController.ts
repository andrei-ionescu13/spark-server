import { Request, Response } from 'express';
import { ListOrderItemsUseCase } from './listOrderItemsUseCase';
import { Controller } from '../../../../controller';
import { UseCaseErrors } from '../../../../appError';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  orderNumber: z.string(),
});

export type ListOrderItemsRequestDto = z.infer<typeof schema>;

export class ListOrderItemsController extends Controller {
  constructor(private useCase: ListOrderItemsUseCase) {
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

      const lineItems = result.value;
      return this.ok(res, lineItems);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
