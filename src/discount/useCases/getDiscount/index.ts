import { DiscountModel } from '../../model';
import { DiscountQueriesRepo } from '../../repo/queries';
import { GetDiscountController } from './getDiscountController';
import { GetDiscountUseCase } from './getDiscountUseCase';

const discountQueriesRepo = new DiscountQueriesRepo(DiscountModel);
const getDiscountUseCase = new GetDiscountUseCase(discountQueriesRepo);
export const getDiscountController = new GetDiscountController(getDiscountUseCase);
