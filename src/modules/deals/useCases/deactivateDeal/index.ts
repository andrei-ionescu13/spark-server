import { Mongo } from '../../../../mongo';
import { DealCommandsRepo } from '../../repo/commands';
import { DeactivateDealController } from './deactivateDealController';
import { DeactivateDealUseCase } from './deactivateDealUseCase';

const dealCommandsRepo = new DealCommandsRepo(Mongo.getCollection('deals'));
const deactivateDealUseCase = new DeactivateDealUseCase(dealCommandsRepo);
export const deactivateDealController = new DeactivateDealController(deactivateDealUseCase);
