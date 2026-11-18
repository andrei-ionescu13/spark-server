import { Request, Response } from 'express';
import { Controller } from '../../../../controller';
import { DeleteProductUseCase } from './deleteProductUseCase';
import * as z from 'zod';
import { zodRequestValidationError } from '../../../../zodErrors';

const schema = z.object({
  productId: z.uuidv7(),
});

export type DeleteProductRequestDto = z.infer<typeof schema>;

export class DeleteProductController extends Controller {
  constructor(private useCase: DeleteProductUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const result = schema.safeParse({
      productId: req.params.productId,
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
          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res, { ok: 'ok' });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
