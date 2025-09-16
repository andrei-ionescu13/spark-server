import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { CouponDto } from '../../couponMapper';
import { CouponCommandsRepoI } from '../../repo/commands';
import { CouponQueriesRepoI } from '../../repo/queries';
import { DeleteCouponRequestDto } from './deleteCouponRequestDto';

type Response = Result<
  CouponDto,
  UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound | UseCaseErrors.DomainValidation
>;

export class DeleteCouponUseCase implements UseCase<DeleteCouponRequestDto, Response> {
  constructor(
    private couponCommandsRepo: CouponCommandsRepoI,
    private couponQueriesRepo: CouponQueriesRepoI,
    private userCommandsRepo: UserCommandsRepoI,
  ) {}

  removeUserCoupon = async (
    id: string,
    couponId: string,
  ): Promise<Result<undefined, UseCaseErrors.DomainValidation | UseCaseErrors.NotFound>> => {
    const userOrError = await this.userCommandsRepo.getUser(id);
    if (userOrError.isErr()) {
      return Result.fail(new UseCaseErrors.DomainValidation(userOrError.error.message));
    }

    const user = userOrError.value;
    if (!user) {
      return Result.fail(new UseCaseErrors.NotFound('User not found'));
    }

    user.removeCoupon(couponId);
    await this.userCommandsRepo.save(user);
    return Result.ok();
  };

  execute = async (request: DeleteCouponRequestDto): Promise<Response> => {
    const { couponId } = request;

    try {
      const coupon = await this.couponQueriesRepo.getCoupon(couponId);

      if (!coupon) {
        return Result.fail(new UseCaseErrors.NotFound('Coupon not found'));
      }

      await this.couponCommandsRepo.deleteCoupon(couponId);
      const result = Result.combine(
        await Promise.all(coupon.users?.map((user) => this.removeUserCoupon(user._id, coupon._id))),
      );

      if (result.isErr()) {
        return Result.fail(result.error);
      }

      return Result.ok(coupon);
    } catch (error) {
      console.error(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
