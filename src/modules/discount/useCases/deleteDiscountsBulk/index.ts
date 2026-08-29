import { Mongo } from '../../../../mongo';
import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DiscountQueriesRepo } from '../../repo/queries';
import { DeleteDiscountsBulkController } from './deleteDiscountsBulkController';
import { DeleteDiscountsBulkUseCase } from './deleteDiscountsBulkUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(Mongo.getCollection('discounts'));
const discountQueriesRepo = new DiscountQueriesRepo(Mongo.getCollection('discounts'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));

const deleteDiscountsBulkUseCase = new DeleteDiscountsBulkUseCase(
  discountCommandsRepo,
  discountQueriesRepo,
  productCommandsRepo,
);
export const deleteDiscountsBulkController = new DeleteDiscountsBulkController(
  deleteDiscountsBulkUseCase,
);
