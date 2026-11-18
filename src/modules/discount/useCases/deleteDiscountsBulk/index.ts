import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DiscountQueriesRepo } from '../../repo/queries';
import { DeleteDiscountsBulkController } from './deleteDiscountsBulkController';
import { DeleteDiscountsBulkUseCase } from './deleteDiscountsBulkUseCase';

const discountCommandsRepo = new DiscountCommandsRepo();
const productCommandsRepo = new ProductCommandsRepo();

const deleteDiscountsBulkUseCase = new DeleteDiscountsBulkUseCase(
  discountCommandsRepo,
  productCommandsRepo,
);
export const deleteDiscountsBulkController = new DeleteDiscountsBulkController(
  deleteDiscountsBulkUseCase,
);
