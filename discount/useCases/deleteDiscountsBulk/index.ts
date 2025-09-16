import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { DiscountRepo } from '../../discountRepo';
import { DiscountModel } from '../../model';
import { DeleteDiscountsBulkController } from './deleteDiscountsBulkController';
import { DeleteDiscountsBulkUseCase } from './deleteDiscountsBulkUseCase';

const discountRepo = new DiscountRepo(DiscountModel);
const productRepo = new ProductRepo(ProductModel);
const deleteDiscountsBulkUseCase = new DeleteDiscountsBulkUseCase(discountRepo, productRepo);
export const deleteDiscountsBulkController = new DeleteDiscountsBulkController(
  deleteDiscountsBulkUseCase,
);
