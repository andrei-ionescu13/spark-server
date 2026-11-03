import { Mongo } from '../../../../mongo';
import { DealQueriesRepo } from '../../repo/queries';
import { SearchDealsController } from './searchDealsController';
import { SearchDealsUseCase } from './searchDealsUseCase';

const dealQueriesRepo = new DealQueriesRepo(Mongo.getCollection('deals'));
const searchDealsUseCase = new SearchDealsUseCase(dealQueriesRepo);
export const searchDealsController = new SearchDealsController(searchDealsUseCase);
