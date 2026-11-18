import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { CreateDiscountController } from './createDiscountController';
import { CreateDiscountUseCase } from './createDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo();
const productCommandsRepo = new ProductCommandsRepo();

const createDiscountUseCase = new CreateDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const createDiscountController = new CreateDiscountController(createDiscountUseCase);
