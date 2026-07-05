import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountModel } from '../../model';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DiscountQueriesRepo } from '../../repo/queries';
import { DeleteDiscountController } from './deleteDiscountController';
import { DeleteDiscountUseCase } from './deleteDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(DiscountModel);
const discountQueriesRepo = new DiscountQueriesRepo(DiscountModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);

const deleteDiscountUseCase = new DeleteDiscountUseCase(
  discountCommandsRepo,
  discountQueriesRepo,
  productCommandsRepo,
);
export const deleteDiscountController = new DeleteDiscountController(deleteDiscountUseCase);
