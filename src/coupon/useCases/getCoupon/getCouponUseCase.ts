import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CouponRepoI } from '../../couponRepo';
import { GetCouponRequestDto } from './getCouponRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetCouponUseCase implements UseCase<GetCouponRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI) {}

  execute = async (request: GetCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const coupon = await this.couponRepo.getCoupon(couponId);
      const found = !!coupon;

      if (!found) {
        return left(new AppError.NotFound('Coupon not found'));
      }

      return right(Result.ok<any>(coupon));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
