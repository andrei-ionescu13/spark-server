import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { GetCouponController } from './getCouponController';
import { GetCouponUseCase } from './getCouponUseCase';

const couponRepo = new CouponRepo(CouponModel);
const getCouponUseCase = new GetCouponUseCase(couponRepo);
export const getCouponController = new GetCouponController(getCouponUseCase);
