import { KeyRepo } from '../../../key/keyRepo';
import { KeyModel } from '../../../key/model';
import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { CreateProductController } from './createProductController';
import { CreateProductUseCase } from './createProductUseCase';

const productRepo = new ProductRepo(ProductModel);
const keyRepo = new KeyRepo(KeyModel);

const uploaderService = new CloudinaryUploaderService();

const createProductUseCase = new CreateProductUseCase(productRepo, keyRepo, uploaderService);
export const createProductController = new CreateProductController(createProductUseCase);
