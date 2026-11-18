import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountApplicableChecker } from '../../discountApplicableChecker';
import { DiscountCommandsRepo } from '../../repo/commands';
import { UpdateDiscountController } from './updateDiscountController';
import { UpdateDiscountUseCase } from './updateDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo();
const productCommandsRepo = new ProductCommandsRepo();

const updateDiscountUseCase = new UpdateDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const updateDiscountController = new UpdateDiscountController(updateDiscountUseCase);
