import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CouponDto } from '../../couponMapper';
import { CouponQueriesRepoI } from '../../repo/queries';
import { GetCouponRequestDto } from './getCouponRequestDto';

type Response = Result<CouponDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetCouponUseCase implements UseCase<GetCouponRequestDto, Response> {
  constructor(private couponQueriesRepo: CouponQueriesRepoI) {}

  execute = async (request: GetCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const coupon = await this.couponQueriesRepo.getCoupon(couponId);

      if (!coupon) {
        return Result.fail(new UseCaseErrors.NotFound('Coupon not found'));
      }

      return Result.ok(coupon);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
