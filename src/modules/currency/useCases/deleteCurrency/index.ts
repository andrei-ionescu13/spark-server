import { Mongo } from '../../../../mongo';
import { CurrencyCommandsRepo } from '../../repo/commands';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { DeleteCurrencyController } from './deleteCurrencyController';
import { DeleteCurrencyUseCase } from './deleteCurrencyUseCase';

const currencyCommandsRepo = new CurrencyCommandsRepo();
const currencyQueriesRepo = new CurrencyQueriesRepo();

const deleteCurrencyUseCase = new DeleteCurrencyUseCase(currencyCommandsRepo, currencyQueriesRepo);
export const deleteCurrencyController = new DeleteCurrencyController(deleteCurrencyUseCase);
