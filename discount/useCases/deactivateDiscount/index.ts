import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { DeactivateDiscountController } from './deactivateDiscountController';
import { DeactivateDiscountUseCase } from './deactivateDiscountUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const deactivateDiscountUseCase = new DeactivateDiscountUseCase(discountRepo);
export const deactivateDiscountController = new DeactivateDiscountController(
  deactivateDiscountUseCase,
);
