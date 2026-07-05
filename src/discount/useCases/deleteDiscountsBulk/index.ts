import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountModel } from '../../model';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DiscountQueriesRepo } from '../../repo/queries';
import { DeleteDiscountsBulkController } from './deleteDiscountsBulkController';
import { DeleteDiscountsBulkUseCase } from './deleteDiscountsBulkUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(DiscountModel);
const discountQueriesRepo = new DiscountQueriesRepo(DiscountModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);

const deleteDiscountsBulkUseCase = new DeleteDiscountsBulkUseCase(
  discountCommandsRepo,
  discountQueriesRepo,
  productCommandsRepo,
);
export const deleteDiscountsBulkController = new DeleteDiscountsBulkController(
  deleteDiscountsBulkUseCase,
);
