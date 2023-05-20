import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { SearchProductsController } from './searchProductsController';
import { SearchProductsUseCase } from './searchProductsUseCase';

const productRepo = new ProductRepo(ProductModel);
const searchProductsUseCase = new SearchProductsUseCase(productRepo);
export const searchProductsController = new SearchProductsController(searchProductsUseCase);
