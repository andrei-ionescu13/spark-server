import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { DealModel } from '../../model';
import { DealCommandsRepo } from '../../repo/commands';
import { DealQueriesRepo } from '../../repo/queries';
import { DeleteDealsBulkController } from './deleteDealsBulkController';
import { DeleteDealsBulkUseCase } from './deleteDealsBulkUseCase';

const dealCommandsRepo = new DealCommandsRepo(DealModel);
const dealQueriesRepo = new DealQueriesRepo(DealModel);

const uploaderService = new CloudinaryUploaderService();

const deleteDealsBulkUseCase = new DeleteDealsBulkUseCase(
  dealCommandsRepo,
  dealQueriesRepo,
  uploaderService,
);
export const deleteDealsBulkController = new DeleteDealsBulkController(deleteDealsBulkUseCase);
