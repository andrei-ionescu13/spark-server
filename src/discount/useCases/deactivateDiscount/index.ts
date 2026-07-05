import { DiscountModel } from '../../model';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DeactivateDiscountController } from './deactivateDiscountController';
import { DeactivateDiscountUseCase } from './deactivateDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(DiscountModel);
const deactivateDiscountUseCase = new DeactivateDiscountUseCase(discountCommandsRepo);
export const deactivateDiscountController = new DeactivateDiscountController(
  deactivateDiscountUseCase,
);
