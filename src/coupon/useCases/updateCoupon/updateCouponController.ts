import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { UpdateCouponRequestDto } from './updateCouponRequestDto';
import { UpdateCouponUseCase } from './updateCouponUseCase';
import { AppError } from '../../../AppError';

export class UpdateCouponController extends BaseController {
  constructor(private useCase: UpdateCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const body = req.body;
    const dto: UpdateCouponRequestDto = {
      couponId: req.params.couponId,
      code: body.code,
      endDate: body.endDate,
      productSelection: body.productSelection,
      products: body.products,
      startDate: body.startDate,
      type: body.type,
      userSelection: body.userSelection,
      users: body.users,
      value: body.value,
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
