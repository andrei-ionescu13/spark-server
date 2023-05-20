import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { UpdateProductMetaController } from './updateProductMetaController';
import { UpdateProductMetaUseCase } from './updateProductMetaUseCase';

const productRepo = new ProductRepo(ProductModel);
const updateProductMetaUseCase = new UpdateProductMetaUseCase(productRepo);
export const updateProductMetaController = new UpdateProductMetaController(
  updateProductMetaUseCase,
);
