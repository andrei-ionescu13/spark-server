import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { UpdateProductDetailsController } from './updateProductDetailsController';
import { UpdateProductDetailsUseCase } from './updateProductDetailsUseCase';

const productRepo = new ProductRepo(ProductModel);
const updateProductDetailsUseCase = new UpdateProductDetailsUseCase(productRepo);
export const updateProductDetailsController = new UpdateProductDetailsController(
  updateProductDetailsUseCase,
);
