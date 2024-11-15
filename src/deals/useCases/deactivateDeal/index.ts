import { DealRepo } from '../../dealRepo';
import { DealModel } from '../../model';
import { DeactivateDealController } from './deactivateDealController';
import { DeactivateDealUseCase } from './deactivateDealUseCase';

const dealRepo = new DealRepo(DealModel);
const deactivateDealUseCase = new DeactivateDealUseCase(dealRepo);
export const deactivateDealController = new DeactivateDealController(deactivateDealUseCase);
