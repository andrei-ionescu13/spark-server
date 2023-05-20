import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { SearchDiscountsController } from './searchDiscountsController';
import { SearchDiscountsUseCase } from './searchDiscountsUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const searchDiscountsUseCase = new SearchDiscountsUseCase(discountRepo);
export const searchDiscountsController = new SearchDiscountsController(searchDiscountsUseCase);
