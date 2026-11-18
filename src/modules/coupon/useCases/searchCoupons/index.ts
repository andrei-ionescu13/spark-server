import { Mongo } from '../../../../mongo';
import { CouponQueriesRepo } from '../../repo/queries';
import { SearchCouponsController } from './searchCouponsController';
import { SearchCouponsUseCase } from './searchCouponsUseCase';

const couponQueriesRepo = new CouponQueriesRepo();

const searchCouponsUseCase = new SearchCouponsUseCase(couponQueriesRepo);

export const searchCouponsController = new SearchCouponsController(searchCouponsUseCase);
