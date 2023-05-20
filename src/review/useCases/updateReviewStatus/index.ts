import { ReviewModel } from '../../model';
import { ReviewRepo } from '../../reviewRepo';
import { UpdateReviewStatusController } from './updateReviewStatusController';
import { UpdateReviewStatusUseCase } from './updateReviewStatusUseCase';

const reviewRepo = new ReviewRepo(ReviewModel);
const updateReviewStatusUseCase = new UpdateReviewStatusUseCase(reviewRepo);
export const updateReviewStatusController = new UpdateReviewStatusController(
  updateReviewStatusUseCase,
);
