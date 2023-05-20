import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ReviewRepoI } from '../../reviewRepo';
import { GetReviewRequestDto } from './getReviewRequestDto';

type Response = Either<AppError.UnexpectedError | AppError.NotFound, Result<any>>;

export class GetReviewUseCase implements UseCase<GetReviewRequestDto, Response> {
  constructor(private reviewRepo: ReviewRepoI) {}

  execute = async (request: GetReviewRequestDto): Promise<Response> => {
    const { reviewId } = request;

    try {
      const review = await this.reviewRepo.getReview(reviewId);
      const found = !!review;

      if (!found) {
        return left(new AppError.NotFound('Review not found'));
      }

      return right(Result.ok<any>(review));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
