import { Request, Response } from 'express';
import { BaseController } from '../../../BaseController';
import { GetCouponRequestDto } from './getCouponRequestDto';
import { GetCouponUseCase } from './getCouponUseCase';
import { AppError } from '../../../AppError';

export class GetCouponController extends BaseController {
  constructor(private useCase: GetCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: GetCouponRequestDto = {
      couponId: req.params.couponId,
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
