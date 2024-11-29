import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { DiscountRepoI } from '../../discountRepo';
import { SearchDiscountsRequestDto } from './searchDiscountsRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchDiscountsUseCase implements UseCase<SearchDiscountsRequestDto, Response> {
  constructor(private discountRepo: DiscountRepoI) {}

  execute = async (request: SearchDiscountsRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;

    try {
      const discounts = await this.discountRepo.searchDiscounts(query);
      const count = await this.discountRepo.getDiscountsCount(query);

      return right(Result.ok<any>({ discounts, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
