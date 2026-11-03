import { Mongo } from '../../../../mongo';
import { CouponQueriesRepo } from '../../repo/queries';
import { GetCouponController } from './getCouponController';
import { GetCouponUseCase } from './getCouponUseCase';

const couponRepo = new CouponQueriesRepo(Mongo.getCollection('coupons'));

const getCouponUseCase = new GetCouponUseCase(couponRepo);

export const getCouponController = new GetCouponController(getCouponUseCase);
