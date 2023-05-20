import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { GetProductController } from './getProductController';
import { GetProductUseCase } from './getProductUseCase';

const productRepo = new ProductRepo(ProductModel);
const getProductUseCase = new GetProductUseCase(productRepo);
export const getProductController = new GetProductController(getProductUseCase);
