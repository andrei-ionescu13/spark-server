import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DiscountDto } from '../../discountMapper';
import { DiscountQueriesRepoI } from '../../repo/queries';
import { SearchDiscountsRequestDto } from './searchDiscountsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<
  {
    discounts: DiscountDto[];
    count: number;
  },
  UseCaseErrors.UnexpectedError
>;

export class SearchDiscountsUseCase implements UseCase<SearchDiscountsRequestDto, Response> {
  constructor(private discountQueriesRepo: DiscountQueriesRepoI) {}

  execute = async (request: SearchDiscountsRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.discountQueriesRepo.searchDiscounts(query);
      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
