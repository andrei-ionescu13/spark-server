import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../../users/userRepo';
import { CouponRepoI } from '../../couponRepo';
import { DeleteCouponRequestDto } from './deleteCouponRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteCouponUseCase implements UseCase<DeleteCouponRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI, private userRepo: UserRepoI) {}

  execute = async (request: DeleteCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const coupon = await this.couponRepo.getCoupon(couponId);

      if (!coupon) {
        return left(new AppError.NotFound('Coupon not found'));
      }

      await this.couponRepo.deleteCoupon(couponId);
      await coupon.users?.map((user) => this.userRepo.deleteCoupon(user._id, coupon._id));

      return right(Result.ok<any>(coupon));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
