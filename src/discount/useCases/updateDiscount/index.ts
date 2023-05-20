import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { UpdateDiscountController } from './updateDiscountController';
import { UpdateDiscountUseCase } from './updateDiscountUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const productRepo = new ProductRepo(ProductModel);
const updateDiscountUseCase = new UpdateDiscountUseCase(discountRepo, productRepo);
export const updateDiscountController = new UpdateDiscountController(updateDiscountUseCase);
