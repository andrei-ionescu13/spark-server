import { DiscountModel } from '../../model';
import { DiscountQueriesRepo } from '../../repo/queries';
import { SearchDiscountsController } from './searchDiscountsController';
import { SearchDiscountsUseCase } from './searchDiscountsUseCase';

const discountQueriesRepo = new DiscountQueriesRepo(DiscountModel);
const searchDiscountsUseCase = new SearchDiscountsUseCase(discountQueriesRepo);
export const searchDiscountsController = new SearchDiscountsController(searchDiscountsUseCase);
