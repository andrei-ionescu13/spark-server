import { ReviewModel } from '../../model';
import { ReviewRepo } from '../../reviewRepo';
import { GetReviewController } from './getReviewController';
import { GetReviewUseCase } from './getReviewUseCase';

const reviewRepo = new ReviewRepo(ReviewModel);
const getReviewUseCase = new GetReviewUseCase(reviewRepo);
export const getReviewController = new GetReviewController(getReviewUseCase);
