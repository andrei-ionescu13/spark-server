import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { DeveloperModel } from '../../model';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { DeleteDevelopersBulkController } from './deleteDevelopersBulkController';
import { DeleteDevelopersBulkUseCase } from './deleteDevelopersBulkUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(DeveloperModel);
const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const productQueriesRepo = new ProductQueriesRepo(ProductModel);

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
