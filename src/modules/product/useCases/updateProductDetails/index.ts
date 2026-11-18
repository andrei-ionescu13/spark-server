import { Mongo } from '../../../../mongo';
import { DiscountCommandsRepo } from '../../../discount/repo/commands';
import { ProductCommandsRepo } from '../../repo/commands';
import { UpdateProductDetailsController } from './updateProductDetailsController';
import { UpdateProductDetailsUseCase } from './updateProductDetailsUseCase';

const productCommandsRepo = new ProductCommandsRepo();
const discountCommandsRepo = new DiscountCommandsRepo();
const updateProductDetailsUseCase = new UpdateProductDetailsUseCase(
  productCommandsRepo,
  discountCommandsRepo,
);
export const updateProductDetailsController = new UpdateProductDetailsController(
  updateProductDetailsUseCase,
);
