import { Mongo } from '../../../../mongo';
import { CurrencyCommandsRepo } from '../../repo/commands';
import { CurrencyQueriesRepo } from '../../repo/queries';
import { AddCurrencyController } from './addCurrencyController';
import { AddCurrencyUseCase } from './addCurrencyUseCase';

const currencyCommandsRepo = new CurrencyCommandsRepo(Mongo.getCollection('currencies'));
const currencyQueriesRepo = new CurrencyQueriesRepo(Mongo.getCollection('currencies'));

const addCurrencyUseCase = new AddCurrencyUseCase(currencyCommandsRepo, currencyQueriesRepo);
export const addCurrencyController = new AddCurrencyController(addCurrencyUseCase);
