import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DealCommandsRepo } from '../../repo/commands';
import { DealQueriesRepo } from '../../repo/queries';
import { DeleteDealsBulkController } from './deleteDealsBulkController';
import { DeleteDealsBulkUseCase } from './deleteDealsBulkUseCase';

const dealCommandsRepo = new DealCommandsRepo(Mongo.getCollection('deals'));
const dealQueriesRepo = new DealQueriesRepo(Mongo.getCollection('deals'));

const uploaderService = new CloudinaryUploaderService();

const deleteDealsBulkUseCase = new DeleteDealsBulkUseCase(
  dealCommandsRepo,
  dealQueriesRepo,
  uploaderService,
);
export const deleteDealsBulkController = new DeleteDealsBulkController(deleteDealsBulkUseCase);
