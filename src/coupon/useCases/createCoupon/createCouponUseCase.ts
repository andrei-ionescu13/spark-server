import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserRepoI } from '../../../users/userRepo';
import { CouponRepoI } from '../../couponRepo';
import { CreateCouponRequestDto } from './createCouponRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class CreateCouponUseCase implements UseCase<CreateCouponRequestDto, Response> {
  constructor(private couponRepo: CouponRepoI, private userRepo: UserRepoI) {}

  execute = async (request: CreateCouponRequestDto): Promise<Response> => {
    const props = request;

    try {
      const coupon = await this.couponRepo.createCoupon(props);
      await coupon.users?.map((user) => this.userRepo.addCoupon(user, coupon));

      return right(Result.ok(coupon));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
