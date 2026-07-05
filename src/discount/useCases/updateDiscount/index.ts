import { ProductModel } from '../../../product/model';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { DiscountModel } from '../../model';
import { DiscountCommandsRepo } from '../../repo/commands';
import { UpdateDiscountController } from './updateDiscountController';
import { UpdateDiscountUseCase } from './updateDiscountUseCase';

const discountCommandsRepo = new DiscountCommandsRepo(DiscountModel);
const productCommandsRepo = new ProductCommandsRepo(ProductModel);

const updateDiscountUseCase = new UpdateDiscountUseCase(discountCommandsRepo, productCommandsRepo);
export const updateDiscountController = new UpdateDiscountController(updateDiscountUseCase);
