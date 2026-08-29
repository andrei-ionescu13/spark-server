import { Mongo } from '../../../../mongo';
import { ProductQueriesRepo } from '../../repo/queries';
import { SearchProductsController } from './searchProductsController';
import { SearchProductsUseCase } from './searchProductsUseCase';

const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const searchProductsUseCase = new SearchProductsUseCase(productQueriesRepo);
export const searchProductsController = new SearchProductsController(searchProductsUseCase);
