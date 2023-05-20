import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { DeactivateCouponController } from './deactivateCouponController';
import { DeactivateCouponUseCase } from './deactivateCouponUseCase';

const couponRepo = new CouponRepo(CouponModel);
const deactivateCouponUseCase = new DeactivateCouponUseCase(couponRepo);
export const deactivateCouponController = new DeactivateCouponController(deactivateCouponUseCase);
