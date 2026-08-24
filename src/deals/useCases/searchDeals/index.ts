import { DealModel } from '../../model';
import { DealQueriesRepo } from '../../repo/queries';
import { SearchDealsController } from './searchDealsController';
import { SearchDealsUseCase } from './searchDealsUseCase';

const dealQueriesRepo = new DealQueriesRepo(DealModel);
const searchDealsUseCase = new SearchDealsUseCase(dealQueriesRepo);
export const searchDealsController = new SearchDealsController(searchDealsUseCase);
