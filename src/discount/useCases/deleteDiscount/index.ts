import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { DeleteDiscountController } from './deleteDiscountController';
import { DeleteDiscountUseCase } from './deleteDiscountUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const productRepo = new ProductRepo(ProductModel);
const deleteDiscountUseCase = new DeleteDiscountUseCase(discountRepo, productRepo);
export const deleteDiscountController = new DeleteDiscountController(deleteDiscountUseCase);
