import { CurrencyModel } from '../../model';
import { CurrencyCommandsRepo } from '../../repo/commands';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { AddCurrencyController } from './addCurrencyController';
import { AddCurrencyUseCase } from './addCurrencyUseCase';

const currencyCommandsRepo = new CurrencyCommandsRepo(CurrencyModel);
const currencyQueriesRepo = new CurrencyQueriesRepo(CurrencyModel);

const addCurrencyUseCase = new AddCurrencyUseCase(currencyCommandsRepo, currencyQueriesRepo);
export const addCurrencyController = new AddCurrencyController(addCurrencyUseCase);
