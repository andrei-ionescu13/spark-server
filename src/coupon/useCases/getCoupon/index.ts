import { CouponModel } from '../../model';
import { CouponQueriesRepo } from '../../repo/queries';
import { GetCouponController } from './getCouponController';
import { GetCouponUseCase } from './getCouponUseCase';

const couponRepo = new CouponQueriesRepo(CouponModel);

const getCouponUseCase = new GetCouponUseCase(couponRepo);

export const getCouponController = new GetCouponController(getCouponUseCase);
