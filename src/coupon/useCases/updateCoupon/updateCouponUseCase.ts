import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../../users/userRepo';
import { CouponRepoI } from '../../couponRepo';
import { UpdateCouponRequestDto } from './updateCouponRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class UpdateCouponUseCase implements UseCase<UpdateCouponRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI, private userRepo: UserRepoI) {}

  execute = async (request: UpdateCouponRequestDto): Promise<Response> => {
    const { couponId, ...rest } = request;
    const props = rest;

    try {
      const promoCode = await this.couponRepo.getCoupon(couponId);
      const found = !!promoCode;

      if (!found) {
        return left(new AppError.NotFound('Coupon not found'));
      }

      if (!!promoCode.users?.length) {
        if (props.userSelection === 'selected') {
          const prevUsers = promoCode.users.map((user) => user._id.toString());
          const removedUsers = prevUsers.filter((user) => !props.users.includes(user));
          await removedUsers.map((user) => this.userRepo.deleteCoupon(user, promoCode._id));
        } else {
          const prevUsers = promoCode.users.map((user) => user._id.toString());
          await prevUsers.map((user) => this.userRepo.deleteCoupon(user, promoCode._id));
        }
      }

      const updatedCoupon = await this.couponRepo.updateCoupon(couponId, props);
      await updatedCoupon.users?.map((user) => this.userRepo.addCoupon(user, promoCode));

      return right(Result.ok<any>(updatedCoupon));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
