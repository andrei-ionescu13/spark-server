import { CurrencyModel } from '../../model';
import { CurrencyCommandsRepo } from '../../repo/commands';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { DeleteCurrencyController } from './deleteCurrencyController';
import { DeleteCurrencyUseCase } from './deleteCurrencyUseCase';

const currencyCommandsRepo = new CurrencyCommandsRepo(CurrencyModel);
const currencyQueriesRepo = new CurrencyQueriesRepo(CurrencyModel);

const deleteCurrencyUseCase = new DeleteCurrencyUseCase(currencyCommandsRepo, currencyQueriesRepo);
export const deleteCurrencyController = new DeleteCurrencyController(deleteCurrencyUseCase);
