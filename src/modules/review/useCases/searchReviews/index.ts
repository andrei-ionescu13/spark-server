import { ReviewModel } from '../../model';
import { ReviewQueriesRepo } from '../../repo/queries';
import { SearchReviewsController } from './searchReviewsController';
import { SearchReviewsUseCase } from './searchReviewsUseCase';

const reviewQueriesRepo = new ReviewQueriesRepo(ReviewModel);
const searchReviewsUseCase = new SearchReviewsUseCase(reviewQueriesRepo);
export const searchReviewsController = new SearchReviewsController(searchReviewsUseCase);
