import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { CouponCommandsRepoI } from '../../repo/commands';
import { CouponQueriesRepoI } from '../../repo/queries';
import { DeleteCouponsBulkRequestDto } from './deleteCouponsBulkRequestDto';

type Response = Result<undefined, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class DeleteCouponsBulkUseCase implements UseCase<DeleteCouponsBulkRequestDto, Response> {
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

  deleteCoupon = async (couponId: string) => {
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
  };

  execute = async (request: DeleteCouponsBulkRequestDto): Promise<Response> => {
    const { ids } = request;

    try {
      const result = Result.combine(
        await Promise.all(ids.map((couponId) => this.deleteCoupon(couponId))),
      );

      if (result.isErr()) {
        return Result.fail(result.error);
      }

      return Result.ok();
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
