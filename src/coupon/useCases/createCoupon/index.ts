import { UserModel } from '../../../users/model';
import { UserRepo } from '../../../users/userRepo';
import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { CreateCouponController } from './createCouponController';
import { CreateCouponUseCase } from './createCouponUseCase';

const couponRepo = new CouponRepo(CouponModel);
const userRepo = new UserRepo(UserModel);
const createCouponUseCase = new CreateCouponUseCase(couponRepo, userRepo);
export const createCouponController = new CreateCouponController(createCouponUseCase);
