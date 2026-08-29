import { Mongo } from '../../../../mongo';
import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { UpdateDiscountController } from './updateDiscountController';
import { UpdateDiscountUseCase } from './updateDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(Mongo.getCollection('discounts'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));

const updateDiscountUseCase = new UpdateDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const updateDiscountController = new UpdateDiscountController(updateDiscountUseCase);
