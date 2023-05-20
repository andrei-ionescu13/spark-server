import { DiscountRepo } from './discountRepo';
import { DiscountModel } from './model';
export { default as discountRoutes } from './routes';

export const discountDb = new DiscountRepo(DiscountModel);
