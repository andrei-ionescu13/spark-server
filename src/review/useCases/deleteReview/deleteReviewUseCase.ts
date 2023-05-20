import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { NotFoundError } from '../../../errors';
import { productServices } from '../../../product';
import { ProductRepoI } from '../../../product/productRepo';
import { UseCase } from '../../../use-case';
import { userDb } from '../../../users';
import { UserRepoI } from '../../../users/userRepo';
import { ReviewRepoI } from '../../reviewRepo';
import { DeleteReviewRequestDto } from './deleteReviewRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class DeleteReviewUseCase implements UseCase<DeleteReviewRequestDto, Response> {
  constructor(
    private reviewRepo: ReviewRepoI,
    private productRepo: ProductRepoI,
    private userRepo: UserRepoI,
  ) {}

  execute = async (request: DeleteReviewRequestDto): Promise<Response> => {
    const { reviewId } = request;

    try {
      const review = await this.reviewRepo.getReview(reviewId);
      const reviewFound = !!review;

      if (!reviewFound) {
        return left(new AppError.NotFound('Review not found'));
      }

      await this.reviewRepo.deleteReview(reviewId);

      const product = await this.productRepo.getProduct(review.product._id);
      const productFound = !!product;

      if (!productFound) {
        return left(new AppError.NotFound('Product not found'));
      }

      await this.productRepo.deleteReview(review.product._id, reviewId);
      await productServices.calculateRating(review.product._id);

      const user = await this.userRepo.getUser(review.user._id);
      const userFound = !!user;

      if (!userFound) {
        return left(new AppError.NotFound('User not found'));
      }

      await this.userRepo.deleteReview(review.user._id, reviewId);

      return right(Result.ok<any>(review));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
