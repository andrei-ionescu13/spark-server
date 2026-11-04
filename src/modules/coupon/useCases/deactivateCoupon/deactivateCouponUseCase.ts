import { UseCaseErrors } from '../../../../appError';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { Coupon } from '../../domain/coupon';
import { CouponCommandsRepoI } from '../../repo/commands';
import { DeactivateCouponRequestDto } from './deactivateCouponRequestDto';

type Response = Result<Coupon, UseCaseErrors.UnexpectedError>;

export class DeactivateCouponUseCase implements UseCase<DeactivateCouponRequestDto, Response> {
  constructor(private couponCommandsRepo: CouponCommandsRepoI) {}

  execute = async (request: DeactivateCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const coupon = await this.couponCommandsRepo.getCoupon(couponId);
      if (!coupon) {
        return Result.fail(new UseCaseErrors.NotFound('Coupon not found'));
      }

      coupon.deactivate();

      await this.couponCommandsRepo.save(coupon);

      return Result.ok(coupon);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
