import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountCommandsRepo } from '../../repo/commands';
import { DiscountQueriesRepo } from '../../repo/queries';
import { DeleteDiscountController } from './deleteDiscountController';
import { DeleteDiscountUseCase } from './deleteDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo();
const productCommandsRepo = new ProductCommandsRepo();

const deleteDiscountUseCase = new DeleteDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const deleteDiscountController = new DeleteDiscountController(deleteDiscountUseCase);
