import { Request, Response } from 'express';
import { UseCaseErrors } from '../../../../AppError';
import { Controller } from '../../../../Controller';
import { DeleteCouponRequestDto } from './deleteCouponRequestDto';
import { DeleteCouponUseCase } from './deleteCouponUseCase';

export class DeleteCouponController extends Controller {
  constructor(private useCase: DeleteCouponUseCase) {
    super();
    this.useCase = useCase;
  }

  executeImpl = async (req: Request, res: Response) => {
    const dto: DeleteCouponRequestDto = {
      couponId: req.params.couponId,
    };

    try {
      const result = await this.useCase.execute(dto);

      if (result.isErr()) {
        const error = result.error;

        switch (error.constructor) {
          case UseCaseErrors.NotFound:
            return this.notFound(res, error.message);

          case UseCaseErrors.DomainValidation:
            return this.unprocessable(res, error.message);

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
