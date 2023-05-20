import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../../users/userRepo';
import { CouponRepoI } from '../../couponRepo';
import { DeleteCouponsBulkRequestDto } from './deleteCouponsBulkRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteCouponsBulkUseCase implements UseCase<DeleteCouponsBulkRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI, private userRepo: UserRepoI) {}

  deleteCoupon = async (couponId) => {
    const coupon = await this.couponRepo.getCoupon(couponId);

    if (!coupon) {
      return left(new AppError.NotFound('Coupon not found'));
    }

    await this.couponRepo.deleteCoupon(couponId);
    await coupon.users?.map((user) => this.userRepo.deleteCoupon(user._id, coupon._id));
  };

  execute = async (request: DeleteCouponsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      await Promise.all(ids.map((couponId) => this.deleteCoupon(couponId)));

      return right(Result.ok());
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
