import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { UpdateProductStatusController } from './updateProductStatusController';
import { UpdateProductStatusUseCase } from './updateProductStatusUseCase';

const productRepo = new ProductRepo(ProductModel);
const updateProductStatusUseCase = new UpdateProductStatusUseCase(productRepo);
export const updateProductStatusController = new UpdateProductStatusController(
  updateProductStatusUseCase,
);
