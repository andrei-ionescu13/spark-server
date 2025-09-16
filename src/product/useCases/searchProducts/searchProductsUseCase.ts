import { UseCaseErrors } from '../../../src/AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { ProductRepoI } from '../../productRepo';
import { SearchProductsRequestDto } from './searchProductsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<UseCaseErrors.UnexpectedError, Result<any>>;

export class SearchProductsUseCase implements UseCase<SearchProductsRequestDto, Response> {
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: SearchProductsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const products = await this.productRepo.searchProducts(query);
      const count = await this.productRepo.getProductsCount(query);

      return right(Result.ok<any>({ products, count }));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
