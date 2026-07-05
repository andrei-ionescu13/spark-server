import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { GetDiscountRequestDto } from './getDiscountRequestDto';
import { GetDiscountUseCase } from './getDiscountUseCase';

export class GetDiscountController extends Controller {
  constructor(private useCase: GetDiscountUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetDiscountRequestDto = {
      discountId: req.params.discountId,
    };

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

      const discount = result.value;
      return this.ok(res, discount);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
