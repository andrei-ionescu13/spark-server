import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../src/AppError';
import { Controller } from '../../../src/Controller';
import { DeactivateDiscountRequestDto } from './deactivateDiscountRequestDto';
import { DeactivateDiscountUseCase } from './deactivateDiscountUseCase';

export class DeactivateDiscountController extends Controller {
  constructor(private useCase: DeactivateDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeactivateDiscountRequestDto = {
      discountId: req.params.discountId,
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

      const value = result.value.getValue();

      return this.ok(res, value);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
