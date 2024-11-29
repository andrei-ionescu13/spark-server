import { AppError } from '../../../AppError';
import { Either, left, Result, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { SearchProductReviewsRequestDto } from './searchProductReviewsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchProductReviewsUseCase
  implements UseCase<SearchProductReviewsRequestDto, Response>
{
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: SearchProductReviewsRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const query: any = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const reviews = await this.productRepo.searchProductReviews(productId, query);

      return right(Result.ok<any>(reviews));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
