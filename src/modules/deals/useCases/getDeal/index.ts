import { Mongo } from '../../../../mongo';
import { DealQueriesRepo } from '../../repo/queries';
import { GetDealController } from './getDealController';
import { GetDealUseCase } from './getDealUseCase';

const dealQueriesRepo = new DealQueriesRepo();
const getDealUseCase = new GetDealUseCase(dealQueriesRepo);
export const getDealController = new GetDealController(getDealUseCase);
