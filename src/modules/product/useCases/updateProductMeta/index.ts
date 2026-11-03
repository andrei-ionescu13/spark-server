import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../repo/commands';
import { UpdateProductMetaController } from './updateProductMetaController';
import { UpdateProductMetaUseCase } from './updateProductMetaUseCase';

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const updateProductMetaUseCase = new UpdateProductMetaUseCase(productCommandsRepo);
export const updateProductMetaController = new UpdateProductMetaController(
  updateProductMetaUseCase,
);
