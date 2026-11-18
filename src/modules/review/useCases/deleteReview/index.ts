import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { ReviewCommandsRepo } from '../../repo/commands';
import { DeleteReviewController } from './deleteReviewController';
import { DeleteReviewUseCase } from './deleteReviewUseCase';

const reviewCommandsRepo = new ReviewCommandsRepo();
const productCommandsRepo = new ProductCommandsRepo();
const userCommandsRepo = new UserCommandsRepo();

const deleteReviewUseCase = new DeleteReviewUseCase(
  reviewCommandsRepo,
  productCommandsRepo,
  userCommandsRepo,
);
export const deleteReviewController = new DeleteReviewController(deleteReviewUseCase);
