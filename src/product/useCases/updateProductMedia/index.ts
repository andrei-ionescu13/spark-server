import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { UpdateProductMediaController } from './updateProductMediaController';
import { UpdateProductMediaUseCase } from './updateProductMediaUseCase';

const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const updateProductMediaUseCase = new UpdateProductMediaUseCase(productRepo, uploaderService);
export const updateProductMediaController = new UpdateProductMediaController(
  updateProductMediaUseCase,
);
