import { ProductModel } from '../../../product/model';
import { ProductRepo } from '../../../product/productRepo';
import { UserModel } from '../../../users/model';
import { UserRepo } from '../../../users/userRepo';
import { ReviewModel } from '../../model';
import { ReviewRepo } from '../../reviewRepo';
import { DeleteReviewController } from './deleteReviewController';
import { DeleteReviewUseCase } from './deleteReviewUseCase';

const reviewRepo = new ReviewRepo(ReviewModel);
const productRepo = new ProductRepo(ProductModel);
const userRepo = new UserRepo(UserModel);

const deleteReviewUseCase = new DeleteReviewUseCase(reviewRepo, productRepo, userRepo);
export const deleteReviewController = new DeleteReviewController(deleteReviewUseCase);
