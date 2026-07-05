import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountModel } from '../../model';
import { DiscountCommandsRepo } from '../../repo/commands';
import { CreateDiscountController } from './createDiscountController';
import { CreateDiscountUseCase } from './createDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(DiscountModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);

const createDiscountUseCase = new CreateDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const createDiscountController = new CreateDiscountController(createDiscountUseCase);
