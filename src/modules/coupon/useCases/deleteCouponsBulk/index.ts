import { Mongo } from '../../../../mongo';
import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { CouponQueriesRepo } from '../../repo/queries';
import { DeleteCouponsBulkController } from './deleteCouponsBulkController';
import { DeleteCouponsBulkUseCase } from './deleteCouponsBulkUseCase';

const couponCommandsRepo = new CouponCommandsRepo(Mongo.getCollection('coupons'));
const couponQueriesRepo = new CouponQueriesRepo(Mongo.getCollection('coupons'));
const userCommandsRepo = new UserCommandsRepo(Mongo.getCollection('users'));

const deleteCouponsBulkUseCase = new DeleteCouponsBulkUseCase(
  couponCommandsRepo,
  couponQueriesRepo,
  userCommandsRepo,
);

export const deleteCouponsBulkController = new DeleteCouponsBulkController(
  deleteCouponsBulkUseCase,
);
