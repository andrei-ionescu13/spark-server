import { ProductModel } from '../../../../product/model';
import { ProductRepo } from '../../../../product/productRepo';
import { UserModel } from '../../../users/model';
import { UserCommandsRepo } from '../../../users/repo/commands';
import { ReviewModel } from '../../model';
import { ReviewCommandsRepo } from '../../repo/commands';
import { DeleteReviewController } from './deleteReviewController';
import { DeleteReviewUseCase } from './deleteReviewUseCase';

const reviewCommandsRepo = new ReviewCommandsRepo(ReviewModel);
const productRepo = new ProductRepo(ProductModel);
const userCommandsRepo = new UserCommandsRepo(UserModel);

const deleteReviewUseCase = new DeleteReviewUseCase(
  reviewCommandsRepo,
  productRepo,
  userCommandsRepo,
);
export const deleteReviewController = new DeleteReviewController(deleteReviewUseCase);
