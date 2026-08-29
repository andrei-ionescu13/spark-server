import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { ProductDto } from '../../productMapper';
import { ProductRepoI } from '../../productRepo';
import { ProductQueriesRepoI } from '../../repo/queries';
import { SearchProductsRequestDto } from './searchProductsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ products: ProductDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchProductsUseCase implements UseCase<SearchProductsRequestDto, Response> {
  constructor(private productQueriesRepo: ProductQueriesRepoI) {}

  execute = async (request: SearchProductsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const result = await this.productQueriesRepo.searchProducts(query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
