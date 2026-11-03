import { Mongo } from '../../../../mongo';
import { CouponCommandsRepo } from '../../repo/commands';
import { DeactivateCouponController } from './deactivateCouponController';
import { DeactivateCouponUseCase } from './deactivateCouponUseCase';

const couponCommandsRepo = new CouponCommandsRepo(Mongo.getCollection('coupons'));

const deactivateCouponUseCase = new DeactivateCouponUseCase(couponCommandsRepo);

export const deactivateCouponController = new DeactivateCouponController(deactivateCouponUseCase);
