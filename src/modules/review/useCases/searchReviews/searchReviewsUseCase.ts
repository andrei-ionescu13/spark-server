import { UseCaseErrors } from '../../../../appErrors';
import { Result } from '../../../../results';
import { UseCase } from '../../../../useCase';
import { ReviewQueriesRepoI } from '../../repo/queries';
import { SearchReviewsRequestDto } from './searchReviewsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<any, UseCaseErrors.UnexpectedError>;

export class SearchReviewsUseCase implements UseCase<SearchReviewsRequestDto, Response> {
  constructor(private reviewQueriesRepo: ReviewQueriesRepoI) {}

  execute = async (request: SearchReviewsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const result = await this.reviewQueriesRepo.searchReviews(query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
