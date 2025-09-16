import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { GetDealController } from './getDealController';
import { GetDealUseCase } from './getDealUseCase';

const dealRepo = new DealRepo(DealModel);
const getDealUseCase = new GetDealUseCase(dealRepo);
export const getDealController = new GetDealController(getDealUseCase);
