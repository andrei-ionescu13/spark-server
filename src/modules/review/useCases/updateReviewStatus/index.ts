import { Mongo } from '../../../../mongo';
import { ReviewCommandsRepo } from '../../repo/commands';
import { UpdateReviewStatusController } from './updateReviewStatusController';
import { UpdateReviewStatusUseCase } from './updateReviewStatusUseCase';

const reviewCommandsRepo = new ReviewCommandsRepo(Mongo.getCollection('reviews'));
const updateReviewStatusUseCase = new UpdateReviewStatusUseCase(reviewCommandsRepo);
export const updateReviewStatusController = new UpdateReviewStatusController(
  updateReviewStatusUseCase,
);
