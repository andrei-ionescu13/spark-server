import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../repo/commands';
import { UpdateProductDetailsController } from './updateProductDetailsController';
import { UpdateProductDetailsUseCase } from './updateProductDetailsUseCase';

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const updateProductDetailsUseCase = new UpdateProductDetailsUseCase(productCommandsRepo);
export const updateProductDetailsController = new UpdateProductDetailsController(
  updateProductDetailsUseCase,
);
