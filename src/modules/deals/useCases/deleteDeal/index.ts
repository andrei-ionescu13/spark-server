import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DealCommandsRepo } from '../../repo/commands';
import { DealQueriesRepo } from '../../repo/queries';
import { DeleteDealController } from './deleteDealController';
import { DeleteDealUseCase } from './deleteDealUseCase';

const dealCommandsRepo = new DealCommandsRepo();
const dealQueriesRepo = new DealQueriesRepo();

const uploaderService = new CloudinaryUploaderService();

const deleteDealUseCase = new DeleteDealUseCase(dealCommandsRepo, dealQueriesRepo, uploaderService);
export const deleteDealController = new DeleteDealController(deleteDealUseCase);
