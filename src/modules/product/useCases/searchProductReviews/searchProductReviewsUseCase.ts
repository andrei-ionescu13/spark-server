import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ReviewDto } from '../../../review/reviewMapper';
import { ProductRepoI } from '../../productRepo';
import { ProductQueriesRepoI } from '../../repo/queries';
import { SearchProductReviewsRequestDto } from './searchProductReviewsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ reviews: ReviewDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchProductReviewsUseCase
  implements UseCase<SearchProductReviewsRequestDto, Response>
{
  constructor(private productQueriesRepo: ProductQueriesRepoI) {}

  execute = async (request: SearchProductReviewsRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const query: any = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const result = await this.productQueriesRepo.searchProductReviews(productId, query);
      return Result.ok(result);
    } catch (error) {
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
