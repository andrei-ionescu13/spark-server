import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { productServices } from '../../../product/services';
import { UseCase } from '../../../use-case';
import { ReviewRepoI } from '../../reviewRepo';
import { UpdateReviewStatusRequestDto } from './updateReviewStatusRequestDto';

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class UpdateReviewStatusUseCase implements UseCase<UpdateReviewStatusRequestDto, Response> {
  constructor(private reviewRepo: ReviewRepoI) {}

  execute = async (request: UpdateReviewStatusRequestDto): Promise<Response> => {
    const { reviewId, status } = request;

    try {
      const updatedReview = await this.reviewRepo.updateReview(reviewId, { status });
      await productServices.calculateRating(updatedReview.product._id);

      return right(Result.ok<string>(updatedReview.status));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
