import { Mongo } from '../../../../mongo';
import { DiscountQueriesRepo } from '../../repo/queries';
import { GetDiscountController } from './getDiscountController';
import { GetDiscountUseCase } from './getDiscountUseCase';

const discountQueriesRepo = new DiscountQueriesRepo(Mongo.getCollection('discounts'));
const getDiscountUseCase = new GetDiscountUseCase(discountQueriesRepo);
export const getDiscountController = new GetDiscountController(getDiscountUseCase);
