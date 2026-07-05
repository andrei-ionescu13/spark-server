import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { DeleteDiscountRequestDto } from './deleteDiscountRequestDto';
import { DeleteDiscountUseCase } from './deleteDiscountUseCase';

export class DeleteDiscountController extends Controller {
  constructor(private useCase: DeleteDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteDiscountRequestDto = {
      discountId: req.params.discountId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.conflict(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const discount = result.value;
      return this.ok(res, discount);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
