import { UseCaseErrors } from '../../../../appError';
import { ProductCommandsRepoI } from '../../../product/repo/commands';
import { productServices } from '../../../product/services';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { ReviewCommandsRepoI } from '../../repo/commands';
import { Review } from '../../domain/review';
import { DeleteReviewRequestDto } from './deleteReviewRequestDto';

type Response = Result<
  Review,
  UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound | UseCaseErrors.DomainValidation
>;

export class DeleteReviewUseCase implements UseCase<DeleteReviewRequestDto, Response> {
  constructor(
    private reviewCommandsRepo: ReviewCommandsRepoI,
    private productCommandsRepo: ProductCommandsRepoI,
    private userCommandsRepo: UserCommandsRepoI,
  ) {}

  execute = async (request: DeleteReviewRequestDto): Promise<Response> => {
    const { reviewId } = request;

    try {
      const review = await this.reviewCommandsRepo.getReview(reviewId);
      if (!review) {
        return Result.fail(new UseCaseErrors.NotFound('Review not found'));
      }

      const product = await this.productCommandsRepo.getProduct(review.product);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const user = await this.userCommandsRepo.getUser(review.user);
      if (!user) {
        return Result.fail(new UseCaseErrors.NotFound('User not found'));
      }

      await this.reviewCommandsRepo.deleteReview(reviewId);

      const productReviews = await this.reviewCommandsRepo.listProductReviews(product._id);
      const ratingOrError = productServices.calculateRating(productReviews);
      if (ratingOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(ratingOrError.error.message));
      }

      const rating = ratingOrError.value;

      user.removeReview(review._id);
      product.updateRating(rating);
      product.removeReview(review._id);

      await this.productCommandsRepo.save(product);
      await this.userCommandsRepo.save(user);

      return Result.ok(review);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
