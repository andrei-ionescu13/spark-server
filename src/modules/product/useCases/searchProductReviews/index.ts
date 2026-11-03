import { Mongo } from '../../../../mongo';
import { ProductRepo } from '../../productRepo';
import { ProductQueriesRepo } from '../../repo/queries';
import { SearchProductReviewsController } from './searchProductReviewsController';
import { SearchProductReviewsUseCase } from './searchProductReviewsUseCase';

const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));
const searchProductReviewsUseCase = new SearchProductReviewsUseCase(productQueriesRepo);
export const searchProductReviewsController = new SearchProductReviewsController(
  searchProductReviewsUseCase,
);
