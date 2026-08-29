import { UseCaseErrors } from '../../../../AppError';
import { Result } from '../../../../Result';
import { UseCase } from '../../../../useCase';
import { KeyDto } from '../../../key/keyMapper';
import { ProductQueriesRepoI } from '../../repo/queries';
import { SearchProductKeysRequestDto } from './searchProductKeysRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ keys: KeyDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchProductKeysUseCase implements UseCase<SearchProductKeysRequestDto, Response> {
  constructor(private productQueriesRepo: ProductQueriesRepoI) {}

  execute = async (request: SearchProductKeysRequestDto): Promise<Response> => {
    const { productId, ...rest } = request;
    const query: any = rest;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const result = await this.productQueriesRepo.searchProductKeys(productId, query);
      return Result.ok(result);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
