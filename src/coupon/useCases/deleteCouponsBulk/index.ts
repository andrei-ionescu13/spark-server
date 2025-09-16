import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { CouponModel } from '../../model';
import { CouponCommandsRepo } from '../../repo/commands';
import { CouponQueriesRepo } from '../../repo/queries';
import { DeleteCouponsBulkController } from './deleteCouponsBulkController';
import { DeleteCouponsBulkUseCase } from './deleteCouponsBulkUseCase';

const couponCommandsRepo = new CouponCommandsRepo(CouponModel);
const couponQueriesRepo = new CouponQueriesRepo(CouponModel);
const userCommandsRepo = new UserCommandsRepo(UserModel);

const deleteCouponsBulkUseCase = new DeleteCouponsBulkUseCase(
  couponCommandsRepo,
  couponQueriesRepo,
  userCommandsRepo,
);

export const deleteCouponsBulkController = new DeleteCouponsBulkController(
  deleteCouponsBulkUseCase,
);
