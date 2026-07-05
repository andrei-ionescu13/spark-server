import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { UpdateProductStatusRequestDto } from './updateProductStatusRequestDto';
import { UpdateProductStatusUseCase } from './updateProductStatusUseCase';

export class UpdateProductStatusController extends Controller {
  constructor(private useCase: UpdateProductStatusUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: UpdateProductStatusRequestDto = {
      productId: req.params.productId,
      status: req.body.status,
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

      const status = result.value.getValue();

      return this.ok(res, status);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
