import { Mongo } from '../../../../mongo';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { SearchCurrenciesController } from './searchCurrenciesController';
import { SearchCurrenciesUseCase } from './searchCurrenciesUseCase';

const currencyQueriesRepo = new CurrencyQueriesRepo(Mongo.getCollection('currencies'));
const searchCurrenciesUseCase = new SearchCurrenciesUseCase(currencyQueriesRepo);
export const searchCurrenciesController = new SearchCurrenciesController(searchCurrenciesUseCase);
