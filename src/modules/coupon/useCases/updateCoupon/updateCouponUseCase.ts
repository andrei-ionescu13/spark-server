import { UseCaseErrors } from '../../../../appErrors';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { Coupon, CreateCouponProps, UpdateCouponProps } from '../../domain/coupon';
import { CouponCode } from '../../domain/couponCode';
import { CouponProductSelection } from '../../domain/couponProductSelection';
import { CouponType } from '../../domain/couponType';
import { CouponUserSelection } from '../../domain/couponUserSelection';
import { CouponValue } from '../../domain/couponValue';
import { CouponCommandsRepoI } from '../../repo/commands';
import { UpdateCouponRequestDto } from './updateCouponRequestDto';

type Response = Result<Coupon, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class UpdateCouponUseCase implements UseCase<UpdateCouponRequestDto, Response> {
  constructor(
    private couponCommandsRepo: CouponCommandsRepoI,
    private userCommandsRepo: UserCommandsRepoI,
  ) {}

  removeCouponFromUser = async (
    id: string,
    couponId: string,
  ): Promise<Result<undefined, UseCaseErrors.DomainValidation | UseCaseErrors.NotFound>> => {
    const user = await this.userCommandsRepo.getUser(id);
    if (!user) {
      return Result.fail(new UseCaseErrors.NotFound('User not found'));
    }

    user.removeCoupon(couponId);
    await this.userCommandsRepo.save(user);

    return Result.ok();
  };

  addCouponToUser = async (
    id: string,
    couponId: string,
  ): Promise<Result<undefined, UseCaseErrors.DomainValidation | UseCaseErrors.NotFound>> => {
    const user = await this.userCommandsRepo.getUser(id);
    if (!user) {
      return Result.fail(new UseCaseErrors.NotFound('User not found'));
    }

    user.addCoupon(couponId);
    await this.userCommandsRepo.save(user);

    return Result.ok();
  };

  execute = async (request: UpdateCouponRequestDto): Promise<Response> => {
    try {
      const coupon = await this.couponCommandsRepo.getCoupon(request.couponId);
      if (!coupon) {
        return Result.fail(new UseCaseErrors.NotFound('Coupon not found'));
      }

      const codeOrError = CouponCode.create(request.code);
      const userSelectionOrError = CouponUserSelection.create(request.userSelection);
      const typeOrError = CouponType.create(request.type);
      const productSelectionOrError = CouponProductSelection.create(request.productSelection);
      const valueOrError = CouponValue.create(request.value);

      const result = Result.combine([
        codeOrError,
        userSelectionOrError,
        typeOrError,
        productSelectionOrError,
        valueOrError,
      ]);

      if (result.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(result.error.message));
      }

      const [code, userSelection, type, productSelection, value] = result.value;
      const props: UpdateCouponProps = {
        code,
        productSelection,
        type,
        userSelection,
        value,
        endDate: request.endDate,
        products: request.products,
        startDate: request.startDate,
        users: request.users,
      };

      const updateResult = coupon.update(props);

      if (updateResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(updateResult.error.message));
      }

      const { newUsers, removedUsers } = updateResult.value;

      const userCouponResult = Result.combine(
        await Promise.all([
          ...removedUsers.map((user) => this.removeCouponFromUser(user, coupon._id)),
          ...newUsers.map((user) => this.addCouponToUser(user, request.couponId)),
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
