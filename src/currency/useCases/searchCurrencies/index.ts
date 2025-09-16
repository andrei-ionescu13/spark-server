import { CurrencyModel } from '../../model';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { SearchCurrenciesController } from './searchCurrenciesController';
import { SearchCurrenciesUseCase } from './searchCurrenciesUseCase';

const currencyQueriesRepo = new CurrencyQueriesRepo(CurrencyModel);
const searchCurrenciesUseCase = new SearchCurrenciesUseCase(currencyQueriesRepo);
export const searchCurrenciesController = new SearchCurrenciesController(searchCurrenciesUseCase);
