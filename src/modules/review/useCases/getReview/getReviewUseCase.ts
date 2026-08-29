import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ReviewQueriesRepoI } from '../../repo/queries';
import { ReviewDto } from '../../reviewMapper';
import { GetReviewRequestDto } from './getReviewRequestDto';

type Response = Result<ReviewDto, UseCaseErrors.UnexpectedError | UseCaseErrors.NotFound>;

export class GetReviewUseCase implements UseCase<GetReviewRequestDto, Response> {
  constructor(private reviewQueriesRepo: ReviewQueriesRepoI) {}

  execute = async (request: GetReviewRequestDto): Promise<Response> => {
    const { reviewId } = request;

    try {
      const review = await this.reviewQueriesRepo.getReview(reviewId);

      if (!review) {
        return Result.fail(new UseCaseErrors.NotFound('Review not found'));
      }

      return Result.ok(review);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
