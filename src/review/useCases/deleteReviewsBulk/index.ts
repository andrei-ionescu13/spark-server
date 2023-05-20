import { ReviewModel } from '../../model';
import { ReviewRepo } from '../../reviewRepo';
import { DeleteReviewsBulkController } from './deleteReviewsBulkController';
import { DeleteReviewsBulkUseCase } from './deleteReviewsBulkUseCase';

const reviewRepo = new ReviewRepo(ReviewModel);
const deleteReviewsBulkUseCase = new DeleteReviewsBulkUseCase(reviewRepo);
export const deleteReviewsBulkController = new DeleteReviewsBulkController(
  deleteReviewsBulkUseCase,
);
