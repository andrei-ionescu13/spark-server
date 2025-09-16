import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponModel } from '../../model';
import { CouponCommandsRepo } from '../../repo/commands';
import { CouponQueriesRepo } from '../../repo/queries';
import { DeleteCouponController } from './deleteCouponController';
import { DeleteCouponUseCase } from './deleteCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(CouponModel);
const couponQueriesRepo = new CouponQueriesRepo(CouponModel);
const userCommandsRepo = new UserCommandsRepo(UserModel);

const deleteCouponUseCase = new DeleteCouponUseCase(
  couponCommandsRepo,
  couponQueriesRepo,
  userCommandsRepo,
);

export const deleteCouponController = new DeleteCouponController(deleteCouponUseCase);
