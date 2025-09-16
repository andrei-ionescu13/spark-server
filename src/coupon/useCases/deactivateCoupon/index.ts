import { CouponModel } from '../../model';
import { CouponCommandsRepo } from '../../repo/commands';
import { DeactivateCouponController } from './deactivateCouponController';
import { DeactivateCouponUseCase } from './deactivateCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(CouponModel);

const deactivateCouponUseCase = new DeactivateCouponUseCase(couponCommandsRepo);

export const deactivateCouponController = new DeactivateCouponController(deactivateCouponUseCase);
