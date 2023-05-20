import { ProductModel } from '../../model';
import { ProductRepo } from '../../productRepo';
import { SearchProductReviewsController } from './searchProductReviewsController';
import { SearchProductReviewsUseCase } from './searchProductReviewsUseCase';

const productRepo = new ProductRepo(ProductModel);
const searchProductReviewsUseCase = new SearchProductReviewsUseCase(productRepo);
export const searchProductReviewsController = new SearchProductReviewsController(
  searchProductReviewsUseCase,
);
