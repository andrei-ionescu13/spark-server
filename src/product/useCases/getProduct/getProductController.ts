import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { GetProductRequestDto } from './getProductRequestDto';
import { GetProductUseCase } from './getProductUseCase';

export class GetProductController extends Controller {
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
          case UseCaseErrors.NotFound:
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
