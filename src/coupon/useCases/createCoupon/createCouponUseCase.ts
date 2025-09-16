import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { Coupon } from '../../coupon';
import { CouponCode } from '../../couponCode';
import { CouponType } from '../../couponType';
import { CouponUserSelection } from '../../couponUserSelection';
import { CouponValue } from '../../couponValue';
import { CouponCommandsRepoI } from '../../repo/commands';
import { CreateCouponRequestDto } from './createCouponRequestDto';

type Response = Result<Coupon, UseCaseErrors.UnexpectedError | UseCaseErrors.ValidationError>;

export class CreateCouponUseCase implements UseCase<CreateCouponRequestDto, Response> {
  constructor(
    private couponCommandsRepo: CouponCommandsRepoI,
    private userCommandsRepo: UserCommandsRepoI,
  ) {}

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

  execute = async (request: CreateCouponRequestDto): Promise<Response> => {
    const props = request;

    try {
      const codeOrError = CouponCode.create(props.code);
      const userSelectionOrError = CouponUserSelection.create(props.userSelection);
      const typeOrError = CouponType.create(props.type);
      const productSelectionOrError = CouponType.create(props.userSelection);
      const valueOrError = CouponValue.create(props.value);

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

      const code = codeOrError.value;
      const userSelection = userSelectionOrError.value;
      const type = typeOrError.value;
      const productSelection = productSelectionOrError.value;
      const value = valueOrError.value;

      const couponOrError = Coupon.create({
        code,
        userSelection,
        type,
        productSelection,
        value,
        endDate: props.endDate || null,
        products: props.products || [],
        startDate: props.startDate,
        users: props.users || [],
        _id: uuidv7(),
      });

      if (couponOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(couponOrError.error.message));
      }

      const coupon = couponOrError.value;
      await this.couponCommandsRepo.save(coupon);

      const userCouponResult = Result.combine(
        await Promise.all(coupon.users.map((user) => this.addUserCoupon(user, coupon._id))),
      );

      if (userCouponResult.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(userCouponResult.error.message));
      }

      this.couponCommandsRepo.save(coupon);
      return Result.ok(coupon);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
