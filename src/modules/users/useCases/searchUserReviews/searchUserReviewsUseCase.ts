import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ReviewDto } from '../../../review/reviewMapper';
import { UserQueriesRepoI } from '../../repo/queries';
import { SearchUserReviewsRequestDto } from './searchUserReviewsRequestDto';

type Response = Result<{ reviews: ReviewDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchUserReviewsUseCase implements UseCase<SearchUserReviewsRequestDto, Response> {
  constructor(private userQueriesRepo: UserQueriesRepoI) {}

  execute = async (request: SearchUserReviewsRequestDto): Promise<Response> => {
    const { userId, ...rest } = request;
    const query = rest;

    try {
      const result = await this.userQueriesRepo.searchUserReviews(userId, query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
