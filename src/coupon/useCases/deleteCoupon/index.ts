import { UserModel } from '../../../users/model';
import { UserRepo } from '../../../users/userRepo';
import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { DeleteCouponController } from './deleteCouponController';
import { DeleteCouponUseCase } from './deleteCouponUseCase';

const couponRepo = new CouponRepo(CouponModel);
const userRepo = new UserRepo(UserModel);
const deleteCouponUseCase = new DeleteCouponUseCase(couponRepo, userRepo);
export const deleteCouponController = new DeleteCouponController(deleteCouponUseCase);
