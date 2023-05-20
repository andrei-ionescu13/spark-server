import { CurrencyRepo } from '../../currencyRepo';
import { CurrencyModel } from '../../model';
import { SearchCurrenciesController } from './searchCurrenciesController';
import { SearchCurrenciesUseCase } from './searchCurrenciesUseCase';

const currencyRepo = new CurrencyRepo(CurrencyModel);
const searchCurrenciesUseCase = new SearchCurrenciesUseCase(currencyRepo);
export const searchCurrenciesController = new SearchCurrenciesController(searchCurrenciesUseCase);
