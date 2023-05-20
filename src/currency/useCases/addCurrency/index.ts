import { CurrencyRepo } from '../../currencyRepo';
import { CurrencyModel } from '../../model';
import { AddCurrencyController } from './addCurrencyController';
import { AddCurrencyUseCase } from './addCurrencyUseCase';

const currencyRepo = new CurrencyRepo(CurrencyModel);
const addCurrencyUseCase = new AddCurrencyUseCase(currencyRepo);
export const addCurrencyController = new AddCurrencyController(addCurrencyUseCase);
