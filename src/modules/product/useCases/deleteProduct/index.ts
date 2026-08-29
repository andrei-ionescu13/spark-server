import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductCommandsRepo } from '../../repo/commands';
import { DeleteProductController } from './deleteProductController';
import { DeleteProductUseCase } from './deleteProductUseCase';

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const uploaderService = new CloudinaryUploaderService();

const deleteProductUseCase = new DeleteProductUseCase(productCommandsRepo, uploaderService);
export const deleteProductController = new DeleteProductController(deleteProductUseCase);
