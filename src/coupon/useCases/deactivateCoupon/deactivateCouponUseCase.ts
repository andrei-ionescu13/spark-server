import { AppError } from '../../../AppError';
import { Either, Result, left } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CouponRepoI } from '../../couponRepo';
import { DeactivateCouponRequestDto } from './deactivateCouponRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class DeactivateCouponUseCase implements UseCase<DeactivateCouponRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI) {}

  execute = async (request: DeactivateCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const coupon = await this.couponRepo.getCoupon(couponId);
      const found = !!coupon;

      if (!found) {
        return left(new AppError.NotFound('Coupon not found'));
      }

      await this.couponRepo.updateCoupon(couponId, { endDate: Date.now() });

      return coupon;
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
