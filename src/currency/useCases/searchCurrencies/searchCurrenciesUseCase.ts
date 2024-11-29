import { AppError } from '../../../AppError';
import { Either, Result, left, right } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CurrencyRepoI } from '../../currencyRepo';
import { SearchCurrenciesRequestDto } from './searchCurrenciesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Either<AppError.UnexpectedError, Result<any>>;

export class SearchCurrenciesUseCase implements UseCase<SearchCurrenciesRequestDto, Response> {
  constructor(private currencyRepo: CurrencyRepoI) {}

  execute = async (request: SearchCurrenciesRequestDto): Promise<Response> => {
    const query = request;
    query.limit = query?.limit && query.limit <= MAX_LIMIT ? query.limit : LIMIT;
    console.log('query', query.keyword);

    try {
      const currencies = await this.currencyRepo.searchCurrencies(query);
      const count = await this.currencyRepo.getCurrenciesCount(query);

      return right(Result.ok<any>({ currencies, count }));
    } catch (error) {
      console.log(error);
      return left(new AppError.UnexpectedError(error));
    }
  };
}
