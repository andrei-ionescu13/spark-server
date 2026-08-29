import { Mongo } from '../../../../mongo';
import { ProductCommandsRepo } from '../../../product/repo/commands';
import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { ReviewCommandsRepo } from '../../repo/commands';
import { DeleteReviewController } from './deleteReviewController';
import { DeleteReviewUseCase } from './deleteReviewUseCase';

const reviewCommandsRepo = new ReviewCommandsRepo(Mongo.getCollection('reviews'));
const productCommandsRepo = new ProductCommandsRepo(Mongo.getCollection('products'));
const userCommandsRepo = new UserCommandsRepo(Mongo.getCollection('users'));

const deleteReviewUseCase = new DeleteReviewUseCase(
  reviewCommandsRepo,
  productCommandsRepo,
  userCommandsRepo,
);
export const deleteReviewController = new DeleteReviewController(deleteReviewUseCase);
