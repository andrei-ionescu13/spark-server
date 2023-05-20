import { UserModel } from '../../../users/model';
import { UserRepo } from '../../../users/userRepo';
import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { DeleteCouponsBulkController } from './deleteCouponsBulkController';
import { DeleteCouponsBulkUseCase } from './deleteCouponsBulkUseCase';

const couponRepo = new CouponRepo(CouponModel);
const userRepo = new UserRepo(UserModel);
const deleteCouponsBulkUseCase = new DeleteCouponsBulkUseCase(couponRepo, userRepo);
export const deleteCouponsBulkController = new DeleteCouponsBulkController(
  deleteCouponsBulkUseCase,
);
