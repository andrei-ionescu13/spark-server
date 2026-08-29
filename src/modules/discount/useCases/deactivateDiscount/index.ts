import { Mongo } from '../../../../mongo';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DeactivateDiscountController } from './deactivateDiscountController';
import { DeactivateDiscountUseCase } from './deactivateDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(Mongo.getCollection('discounts'));
const deactivateDiscountUseCase = new DeactivateDiscountUseCase(discountCommandsRepo);
export const deactivateDiscountController = new DeactivateDiscountController(
  deactivateDiscountUseCase,
);
