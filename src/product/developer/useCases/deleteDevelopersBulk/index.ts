import { ProductModel } from '../../../../../product/model';
import { ProductRepo } from '../../../../../product/productRepo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DeveloperModel } from '../../model';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { DeleteDevelopersBulkController } from './deleteDevelopersBulkController';
import { DeleteDevelopersBulkUseCase } from './deleteDevelopersBulkUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(DeveloperModel);
const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deleteDevelopersBulkUseCase = new DeleteDevelopersBulkUseCase(
  developerCommandsRepo,
  developerQueriesRepo,
  productRepo,
  uploaderService,
);
export const deleteDevelopersBulkController = new DeleteDevelopersBulkController(
  deleteDevelopersBulkUseCase,
);
