import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DealCommandsRepo } from '../../repo/commands';
import { DealQueriesRepo } from '../../repo/queries';
import { DeleteDealController } from './deleteDealController';
import { DeleteDealUseCase } from './deleteDealUseCase';

const dealCommandsRepo = new DealCommandsRepo(Mongo.getCollection('deals'));
const dealQueriesRepo = new DealQueriesRepo(Mongo.getCollection('deals'));

const uploaderService = new CloudinaryUploaderService();

const deleteDealUseCase = new DeleteDealUseCase(dealCommandsRepo, dealQueriesRepo, uploaderService);
export const deleteDealController = new DeleteDealController(deleteDealUseCase);
