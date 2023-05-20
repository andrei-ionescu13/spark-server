import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetProductRequestDto } from './getProductRequestDto';
import { GetProductUseCase } from './getProductUseCase';
import { AppError } from '../../../AppError';

export class GetProductController extends BaseController {
  constructor(private useCase: GetProductUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetProductRequestDto = {
      productId: req.params.productId,
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

      const product = result.value.getValue();

      return this.ok(res, product);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
