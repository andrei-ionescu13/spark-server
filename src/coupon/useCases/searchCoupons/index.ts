import { CouponRepo } from '../../couponRepo';
import { CouponModel } from '../../model';
import { SearchCouponsController } from './searchCouponsController';
import { SearchCouponsUseCase } from './searchCouponsUseCase';

const couponRepo = new CouponRepo(CouponModel);
const searchCouponsUseCase = new SearchCouponsUseCase(couponRepo);
export const searchCouponsController = new SearchCouponsController(searchCouponsUseCase);
