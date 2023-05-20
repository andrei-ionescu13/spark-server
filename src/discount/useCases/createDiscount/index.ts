import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { CreateDiscountController } from './createDiscountController';
import { CreateDiscountUseCase } from './createDiscountUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const productRepo = new ProductRepo(ProductModel);
const createDiscountUseCase = new CreateDiscountUseCase(discountRepo, productRepo);
export const createDiscountController = new CreateDiscountController(createDiscountUseCase);
