import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { DeleteProductRequestDto } from './deleteProductRequestDto';
import { DeleteProductUseCase } from './deleteProductUseCase';

export class DeleteProductController extends BaseController {
  constructor(private useCase: DeleteProductUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteProductRequestDto = {
      productId: req.params.productId,
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

      // const result = result.value.getValue();
      return this.ok(res, { ok: 'ok' });
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
