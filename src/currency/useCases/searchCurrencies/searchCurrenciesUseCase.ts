import { UseCaseErrors } from '../../../AppError';
import { Result } from '../../../Result';
import { UseCase } from '../../../use-case';
import { CurrencyDto } from '../../currencyMapper';
import { CurrencyQueriesRepoI } from '../../repo/queries';
import { SearchCurrenciesRequestDto } from './searchCurrenciesRequestDto';

const MAX_LIMIT = 36;
const LIMIT = 10;

type Response = Result<{ currencies: CurrencyDto[]; count: number }, UseCaseErrors.UnexpectedError>;

export class SearchCurrenciesUseCase implements UseCase<SearchCurrenciesRequestDto, Response> {
  constructor(private currencyQueriesRepo: CurrencyQueriesRepoI) {}

  execute = async (request: SearchCurrenciesRequestDto): Promise<Response> => {
    const query = {
      ...request,
      limit: request?.limit && request.limit <= MAX_LIMIT ? request.limit : LIMIT,
    };

    try {
      const searchResult = await this.currencyQueriesRepo.searchCurrencies(query);

      return Result.ok(searchResult);
    } catch (error) {
      console.log(error);
      return Result.fail(new UseCaseErrors.UnexpectedError(error));
    }
  };
}
