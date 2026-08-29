import { Mongo } from '../../../../mongo';
import { DiscountQueriesRepo } from '../../repo/queries';
import { SearchDiscountsController } from './searchDiscountsController';
import { SearchDiscountsUseCase } from './searchDiscountsUseCase';

const discountQueriesRepo = new DiscountQueriesRepo(Mongo.getCollection('discounts'));
const searchDiscountsUseCase = new SearchDiscountsUseCase(discountQueriesRepo);
export const searchDiscountsController = new SearchDiscountsController(searchDiscountsUseCase);
