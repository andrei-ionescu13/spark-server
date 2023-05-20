import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetDiscountRequestDto } from './getDiscountRequestDto';
import { GetDiscountUseCase } from './getDiscountUseCase';
import { AppError } from '../../../AppError';

export class GetDiscountController extends BaseController {
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

      if (result.isLeft()) {
        const error = result.value;

        switch (error.constructor) {
          case AppError.NotFound:
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
