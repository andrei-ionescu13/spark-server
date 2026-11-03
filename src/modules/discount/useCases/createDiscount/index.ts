import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { CreateDiscountController } from './createDiscountController';
import { CreateDiscountUseCase } from './createDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(Mongo.getCollection('discounts'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));

const createDiscountUseCase = new CreateDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const createDiscountController = new CreateDiscountController(createDiscountUseCase);
