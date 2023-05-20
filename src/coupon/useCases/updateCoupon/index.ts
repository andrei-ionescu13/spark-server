import { UserModel } from '../../../users/model';
import { UserRepo } from '../../../users/userRepo';
import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { UpdateCouponController } from './updateCouponController';
import { UpdateCouponUseCase } from './updateCouponUseCase';

const couponRepo = new CouponRepo(CouponModel);
const userRepo = new UserRepo(UserModel);
const updateCouponUseCase = new UpdateCouponUseCase(couponRepo, userRepo);
export const updateCouponController = new UpdateCouponController(updateCouponUseCase);
