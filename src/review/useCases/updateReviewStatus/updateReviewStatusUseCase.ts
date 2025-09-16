import { productServices } from '../../../../product/services';
import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ReviewCommandsRepoI } from '../../repo/commands';
import { ReviewStatus } from '../../reviewStatus';
import { UpdateReviewStatusRequestDto } from './updateReviewStatusRequestDto';

type Response = Result<
  string,
  UseCaseErrors.DomainValidation | UseCaseErrors.NotFound | UseCaseErrors.UnexpectedError
>;

export class UpdateReviewStatusUseCase implements UseCase<UpdateReviewStatusRequestDto, Response> {
  constructor(private reviewCommandsRepo: ReviewCommandsRepoI) {}

  execute = async (request: UpdateReviewStatusRequestDto): Promise<Response> => {
    const { reviewId, status } = request;

    try {
      const reviewOrError = await this.reviewCommandsRepo.getReview(reviewId);
      if (reviewOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(reviewOrError.error.message));
      }

      const review = reviewOrError.value;
      if (!review) {
        return Result.fail(new UseCaseErrors.NotFound('Review not found'));
      }

      const newStatusOrError = ReviewStatus.create(status);
      if (newStatusOrError.isErr()) {
        return Result.fail(new UseCaseErrors.DomainValidation(newStatusOrError.error.message));
      }

      const newStatus = newStatusOrError.value;
      review.updateStatus(newStatus);
      //change this
      await productServices.calculateRating(review.product);

      return Result.ok(review.status.value);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
