import { v7 as uuidv7 } from 'uuid';
import { UseCaseErrors } from '../../../../appError';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { Coupon, CreateCouponProps } from '../../domain/coupon';
import { CouponCode } from '../../domain/couponCode';
import { CouponType } from '../../domain/couponType';
import { CouponUserSelection } from '../../domain/couponUserSelection';
import { CouponValue } from '../../domain/couponValue';
import { CouponCommandsRepoI } from '../../repo/commands';
import { CreateCouponRequestDto } from './createCouponRequestDto';
import { CouponProductSelection } from '../../domain/couponProductSelection';

type Response = Result<Coupon, UseCaseErrors.UnexpectedError | UseCaseErrors.ValidationError>;

export class CreateCouponUseCase implements UseCase<CreateCouponRequestDto, Response> {
  constructor(
    private couponCommandsRepo: CouponCommandsRepoI,
    private userCommandsRepo: UserCommandsRepoI,
  ) {}

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

  execute = async (request: CreateCouponRequestDto): Promise<Response> => {
    try {
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
      const props: CreateCouponProps = {
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

      const couponOrError = Coupon.create(props);
      if (couponOrError.isErr()) {
        return Result.fail(new UseCaseErrors.ValidationError(couponOrError.error.message));
      }

      const coupon = couponOrError.value;
      await this.couponCommandsRepo.save(coupon);

      if (coupon.users) {
        const userCouponResult = Result.combine(
          await Promise.all(coupon.users.map((user) => this.addCouponToUser(user, coupon._id))),
        );

        if (userCouponResult.isErr()) {
          return Result.fail(new UseCaseErrors.DomainValidation(userCouponResult.error.message));
        }
      }

      this.couponCommandsRepo.save(coupon);
      return Result.ok(coupon);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
