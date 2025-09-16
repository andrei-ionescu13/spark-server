import { CouponModel } from '../../model';
import { CouponQueriesRepo } from '../../repo/queries';
import { SearchCouponsController } from './searchCouponsController';
import { SearchCouponsUseCase } from './searchCouponsUseCase';

const couponQueriesRepo = new CouponQueriesRepo(CouponModel);

const searchCouponsUseCase = new SearchCouponsUseCase(couponQueriesRepo);

export const searchCouponsController = new SearchCouponsController(searchCouponsUseCase);
