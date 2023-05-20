import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { GetDiscountController } from './getDiscountController';
import { GetDiscountUseCase } from './getDiscountUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const getDiscountUseCase = new GetDiscountUseCase(discountRepo);
export const getDiscountController = new GetDiscountController(getDiscountUseCase);
