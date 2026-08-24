import { DealModel } from '../../model';
import { DealCommandsRepo } from '../../repo/commands';
import { DeactivateDealController } from './deactivateDealController';
import { DeactivateDealUseCase } from './deactivateDealUseCase';

const dealCommandsRepo = new DealCommandsRepo(DealModel);
const deactivateDealUseCase = new DeactivateDealUseCase(dealCommandsRepo);
export const deactivateDealController = new DeactivateDealController(deactivateDealUseCase);
