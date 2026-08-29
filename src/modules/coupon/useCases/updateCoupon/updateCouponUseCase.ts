import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { Coupon } from '../../coupon';
import { CouponCode } from '../../couponCode';
import { CouponType } from '../../couponType';
import { CouponValue } from '../../couponValue';
import { CouponCommandsRepoI } from '../../repo/commands';
import { UpdateCouponRequestDto } from './updateCouponRequestDto';

type Response = Result<Coupon, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateCouponUseCase implements UseCase<UpdateCouponRequestDto, Response> {
  constructor(
    private couponCommandsRepo: CouponCommandsRepoI,
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

  addUserCoupon = async (
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

    user.addCoupon(couponId);
    await this.userCommandsRepo.save(user);

    return Result.ok();
  };

  execute = async (request: UpdateCouponRequestDto): Promise<Response> => {
    const { couponId, ...props } = request;

    try {
      const couponOrError = await this.couponCommandsRepo.getCoupon(couponId);
      if (couponOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(couponOrError.error.message));
      }

      const coupon = couponOrError.value;

      if (!coupon) {
        return Result.fail(new UseCaseErrors.NotFound('Coupon not found'));
      }

      const codeOrError = CouponCode.create(props.code);
      const typeOrError = CouponType.create(props.type);
      const valueOrError = CouponValue.create(props.value);

      const result = Result.combine([codeOrError, typeOrError, valueOrError]);

      if (result.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(result.error.message));
      }

      const code = codeOrError.value;
      const type = typeOrError.value;
      const value = valueOrError.value;

      const updateResult = coupon.update({
        ...props,
        code,
        type,
        value,
      });

      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      const { newUsers, removedUsers } = updateResult.value;

      const userCouponResult = Result.combine(
        await Promise.all([
          ...removedUsers.map((user) => this.removeUserCoupon(user, coupon._id)),
          ...newUsers.map((user) => this.addUserCoupon(user, couponId)),
        ]),
      );

      if (userCouponResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(userCouponResult.error.message));
      }

      this.couponCommandsRepo.save(coupon);
      return Result.ok(coupon);
    } catch (error) {
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
