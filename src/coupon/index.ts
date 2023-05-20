import { CouponRepo } from './couponRepo';
import { CouponModel } from './model';
export { default as promoCodeRoutes } from './routes';

export const promoCodeDb = new CouponRepo(CouponModel);
