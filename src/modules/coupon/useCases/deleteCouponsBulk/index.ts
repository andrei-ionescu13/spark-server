import { Mongo } from '../../../../mongo';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponCommandsRepo } from '../../repo/commands';
import { CouponQueriesRepo } from '../../repo/queries';
import { DeleteCouponsBulkController } from './deleteCouponsBulkController';
import { DeleteCouponsBulkUseCase } from './deleteCouponsBulkUseCase';

const couponCommandsRepo = new CouponCommandsRepo();
const couponQueriesRepo = new CouponQueriesRepo();
const userCommandsRepo = new UserCommandsRepo();

const deleteCouponsBulkUseCase = new DeleteCouponsBulkUseCase(
  couponCommandsRepo,
  couponQueriesRepo,
  userCommandsRepo,
);

export const deleteCouponsBulkController = new DeleteCouponsBulkController(
  deleteCouponsBulkUseCase,
);
