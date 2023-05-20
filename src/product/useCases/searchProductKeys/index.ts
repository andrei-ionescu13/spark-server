import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { SearchProductKeysController } from './searchProductKeysController';
import { SearchProductKeysUseCase } from './searchProductKeysUseCase';

const productRepo = new ProductRepo(ProductModel);
const searchProductKeysUseCase = new SearchProductKeysUseCase(productRepo);
export const searchProductKeysController = new SearchProductKeysController(
  searchProductKeysUseCase,
);
