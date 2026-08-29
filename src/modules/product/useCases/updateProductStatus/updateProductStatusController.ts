import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.forbidden(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      return this.ok(res);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
