import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { CreateProductController } from './createProductController';
import { CreateProductUseCase } from './createProductUseCase';

const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const createProductUseCase = new CreateProductUseCase(productRepo, uploaderService);
export const createProductController = new CreateProductController(createProductUseCase);
