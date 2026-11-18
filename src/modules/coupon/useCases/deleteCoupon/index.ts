import { Mongo } from '../../../../mongo';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { CouponQueriesRepo } from '../../repo/queries';
import { DeleteCouponController } from './deleteCouponController';
import { DeleteCouponUseCase } from './deleteCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo();
const couponQueriesRepo = new CouponQueriesRepo();
const userCommandsRepo = new UserCommandsRepo();

const deleteCouponUseCase = new DeleteCouponUseCase(
  couponCommandsRepo,
  couponQueriesRepo,
  userCommandsRepo,
);

export const deleteCouponController = new DeleteCouponController(deleteCouponUseCase);
