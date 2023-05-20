import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ReviewRepoI } from '../../reviewRepo';
import { SearchReviewsRequestDto } from './searchReviewsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchReviewsUseCase implements UseCase<SearchReviewsRequestDto, Response> {
  constructor(private reviewRepo: ReviewRepoI) {}

  execute = async (request: SearchReviewsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const reviews = await this.reviewRepo.searchReviews(query);
      const count = await this.reviewRepo.getReviewsCount(query);

      return right(Result.ok<any>({ reviews, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
