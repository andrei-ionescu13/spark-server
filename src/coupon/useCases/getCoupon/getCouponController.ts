import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../AppError';
import { Controller } from '../../../Controller';
import { GetCouponRequestDto } from './getCouponRequestDto';
import { GetCouponUseCase } from './getCouponUseCase';

export class GetCouponController extends Controller {
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

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          default:
            return this.fail(res, error);
        }
      }

      const coupon = result.value;
      return this.ok(res, coupon);
    } catch (error) {
      console.log(error);
      return this.fail(res, error);
    }
  };
}
