import { Mongo } from '../../../../mongo';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { CouponQueriesRepo } from '../../repo/queries';
import { DeleteCouponController } from './deleteCouponController';
import { DeleteCouponUseCase } from './deleteCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(Mongo.getCollection('coupons'));
const couponQueriesRepo = new CouponQueriesRepo(Mongo.getCollection('coupons'));
const userCommandsRepo = new UserCommandsRepo(Mongo.getCollection('users'));

const deleteCouponUseCase = new DeleteCouponUseCase(
  couponCommandsRepo,
  couponQueriesRepo,
  userCommandsRepo,
);

export const deleteCouponController = new DeleteCouponController(deleteCouponUseCase);
