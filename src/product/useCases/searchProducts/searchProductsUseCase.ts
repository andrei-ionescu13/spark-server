import { productDb } from '../..';
import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { ProductRepoI } from '../../productRepo';
import { SearchProductsRequestDto } from './searchProductsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 12;

type Response = Either<AppError.UnexpectedError, Result<any>>;

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
      return left(new AppError.UnexpectedError(error));
    }
  };
}
