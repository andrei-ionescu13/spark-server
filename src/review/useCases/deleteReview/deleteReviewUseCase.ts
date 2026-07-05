import { UseCaseErrors } from '../../../AppError';
import { ProductRepoI } from '../../../product/productRepo';
import { productServices } from '../../../product/services';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { UserCommandsRepoI } from '../../../users/repo/commands';
import { ReviewCommandsRepoI } from '../../repo/commands';
import { Review } from '../../review';
import { DeleteReviewRequestDto } from './deleteReviewRequestDto';

type Response = Result<
  Review,
  UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound | UseCaseErrors.DomainValidation
>;

export class DeleteReviewUseCase implements UseCase<DeleteReviewRequestDto, Response> {
  constructor(
    private reviewCommandsRepo: ReviewCommandsRepoI,
    private productRepo: ProductRepoI,
    private userCommandsRepo: UserCommandsRepoI,
  ) {}

  execute = async (request: DeleteReviewRequestDto): Promise<Response> => {
    const { reviewId } = request;

    try {
      const reviewOrError = await this.reviewCommandsRepo.getReview(reviewId);
      if (reviewOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(reviewOrError.error.message));
      }

      const review = reviewOrError.value;
      if (!review) {
        return Result.fail(new UseCaseErrors.NotFound('Review not found'));
      }

      const product = await this.productRepo.getProduct(review.product);
      if (!product) {
        return Result.fail(new UseCaseErrors.NotFound('Product not found'));
      }

      const userOrError = await this.userCommandsRepo.getUser(review.user);
      if (userOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(userOrError.error.message));
      }

      const user = userOrError.value;
      if (!user) {
        return Result.fail(new UseCaseErrors.NotFound('User not found'));
      }

      await this.reviewCommandsRepo.deleteReview(reviewId);
      //change this
      await this.productRepo.deleteReview(review.product, reviewId);
      await productServices.calculateRating(review.product);

      user.removeReview(review._id);
      await this.userCommandsRepo.save(user);

      return Result.ok(review);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
