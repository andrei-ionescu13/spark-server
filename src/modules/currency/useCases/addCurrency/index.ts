import { Mongo } from '../../../../mongo';
import { CurrencyCommandsRepo } from '../../repo/commands';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { AddCurrencyController } from './addCurrencyController';
import { AddCurrencyUseCase } from './addCurrencyUseCase';

const currencyCommandsRepo = new CurrencyCommandsRepo();
const currencyQueriesRepo = new CurrencyQueriesRepo();

const addCurrencyUseCase = new AddCurrencyUseCase(currencyCommandsRepo, currencyQueriesRepo);
export const addCurrencyController = new AddCurrencyController(addCurrencyUseCase);
