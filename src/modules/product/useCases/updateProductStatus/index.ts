import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../repo/commands';
import { UpdateProductStatusController } from './updateProductStatusController';
import { UpdateProductStatusUseCase } from './updateProductStatusUseCase';

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const updateProductStatusUseCase = new UpdateProductStatusUseCase(productCommandsRepo);
export const updateProductStatusController = new UpdateProductStatusController(
  updateProductStatusUseCase,
);
