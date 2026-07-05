import { UseCaseErrors } from '../../../AppError';
import { Either, Result, left, right } from '../../../src/Result';
import { UseCase } from '../../../src/use-case';
import { ProductRepoI } from '../../productRepo';
import { SearchProductKeysRequestDto } from './searchProductKeysRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<UseCaseErrors.UnexpectedError, Result<any>>;

export class SearchProductKeysUseCase implements UseCase<SearchProductKeysRequestDto, Response> {
  constructor(private productRepo: ProductRepoI) {}

  execute = async (request: SearchProductKeysRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const query: any = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const keys = await this.productRepo.searchProductKeys(productId, query);

      return right(Result.ok<any>(keys));
    } catch (error) {
      console.log(error);
      return left(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
