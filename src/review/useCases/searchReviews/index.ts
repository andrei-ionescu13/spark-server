import { ReviewModel } from '../../model';
import { ReviewRepo } from '../../reviewRepo';
import { SearchReviewsController } from './searchReviewsController';
import { SearchReviewsUseCase } from './searchReviewsUseCase';

const reviewRepo = new ReviewRepo(ReviewModel);
const searchReviewsUseCase = new SearchReviewsUseCase(reviewRepo);
export const searchReviewsController = new SearchReviewsController(searchReviewsUseCase);
