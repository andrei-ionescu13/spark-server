import { CurrencyRepo } from '../../currencyRepo';
import { CurrencyModel } from '../../model';
import { DeleteCurrencyController } from './deleteCurrencyController';
import { DeleteCurrencyUseCase } from './deleteCurrencyUseCase';

const currencyRepo = new CurrencyRepo(CurrencyModel);
const deleteCurrencyUseCase = new DeleteCurrencyUseCase(currencyRepo);
export const deleteCurrencyController = new DeleteCurrencyController(deleteCurrencyUseCase);
