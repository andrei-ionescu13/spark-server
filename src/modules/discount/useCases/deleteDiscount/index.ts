import { Mongo } from '../../../../mongo';
import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DiscountQueriesRepo } from '../../repo/queries';
import { DeleteDiscountController } from './deleteDiscountController';
import { DeleteDiscountUseCase } from './deleteDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(Mongo.getCollection('discounts'));
const discountQueriesRepo = new DiscountQueriesRepo(Mongo.getCollection('discounts'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));

const deleteDiscountUseCase = new DeleteDiscountUseCase(
  discountCommandsRepo,
  discountQueriesRepo,
  productCommandsRepo,
);
export const deleteDiscountController = new DeleteDiscountController(deleteDiscountUseCase);
