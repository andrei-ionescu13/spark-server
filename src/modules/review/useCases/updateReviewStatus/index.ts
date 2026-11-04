import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { ReviewCommandsRepo } from '../../repo/commands';
import { UpdateReviewStatusController } from './updateReviewStatusController';
import { UpdateReviewStatusUseCase } from './updateReviewStatusUseCase';

const reviewCommandsRepo = new ReviewCommandsRepo(Mongo.getCollection('reviews'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('product'));
const updateReviewStatusUseCase = new UpdateReviewStatusUseCase(
  reviewCommandsRepo,
  productCommandsRepo,
);
export const updateReviewStatusController = new UpdateReviewStatusController(
  updateReviewStatusUseCase,
);
