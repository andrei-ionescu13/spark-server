import { Mongo } from '../../../../mongo';
import { ProductQueriesRepo } from '../../repo/queries';
import { SearchProductKeysController } from './searchProductKeysController';
import { SearchProductKeysUseCase } from './searchProductKeysUseCase';

const productQueriesRepo = new ProductQueriesRepo();
const searchProductKeysUseCase = new SearchProductKeysUseCase(productQueriesRepo);
export const searchProductKeysController = new SearchProductKeysController(
  searchProductKeysUseCase,
);
