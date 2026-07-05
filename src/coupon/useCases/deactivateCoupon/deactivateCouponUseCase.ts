import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { Coupon } from '../../coupon';
import { CouponCommandsRepoI } from '../../repo/commands';
import { DeactivateCouponRequestDto } from './deactivateCouponRequestDto';

type Response = Result<Coupon, UseCaseErrors.UnexpectedError>;

export class DeactivateCouponUseCase implements UseCase<DeactivateCouponRequestDto, Response> {
  constructor(private couponCommandsRepo: CouponCommandsRepoI) {}

  execute = async (request: DeactivateCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const couponOrError = await this.couponCommandsRepo.getCoupon(couponId);
      if (couponOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(couponOrError.error.message));
      }

      const coupon = couponOrError.value;
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
