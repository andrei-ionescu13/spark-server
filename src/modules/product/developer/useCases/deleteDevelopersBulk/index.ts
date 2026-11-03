import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { ProductModel } from '../../../model';
import { ProductQueriesRepo } from '../../../repo/queries';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { DeleteDevelopersBulkController } from './deleteDevelopersBulkController';
import { DeleteDevelopersBulkUseCase } from './deleteDevelopersBulkUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(Mongo.getCollection('developers'));
const developerQueriesRepo = new DeveloperQueriesRepo(Mongo.getCollection('developers'));
const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));

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
