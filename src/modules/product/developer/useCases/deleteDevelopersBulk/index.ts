import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { ProductQueriesRepo } from '../../../repo/queries';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { DeleteDevelopersBulkController } from './deleteDevelopersBulkController';
import { DeleteDevelopersBulkUseCase } from './deleteDevelopersBulkUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo();
const developerQueriesRepo = new DeveloperQueriesRepo();
const productQueriesRepo = new ProductQueriesRepo();

const uploaderService = new CloudinaryUploaderService();

const deleteDevelopersBulkUseCase = new DeleteDevelopersBulkUseCase(
  developerCommandsRepo,
  developerQueriesRepo,
  productQueriesRepo,
  uploaderService,
);
export const deleteDevelopersBulkController = new DeleteDevelopersBulkController(
  deleteDevelopersBulkUseCase,
);
