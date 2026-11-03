import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductCommandsRepo } from '../../repo/commands';
import { UpdateProductMediaController } from './updateProductMediaController';
import { UpdateProductMediaUseCase } from './updateProductMediaUseCase';

const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const uploaderService = new CloudinaryUploaderService();
const updateProductMediaUseCase = new UpdateProductMediaUseCase(
  productCommandsRepo,
  uploaderService,
);
export const updateProductMediaController = new UpdateProductMediaController(
  updateProductMediaUseCase,
);
