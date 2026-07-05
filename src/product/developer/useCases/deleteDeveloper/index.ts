import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { ProductModel } from '../../../model';
import { ProductRepo } from '../../../productRepo';
import { DeveloperModel } from '../../model';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { DeleteDeveloperController } from './deleteDeveloperController';
import { DeleteDeveloperUseCase } from './deleteDeveloperUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(DeveloperModel);
const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const productRepo = new ProductRepo(ProductModel);

const uploaderService = new CloudinaryUploaderService();

const deleteDeveloperUseCase = new DeleteDeveloperUseCase(
  developerCommandsRepo,
  developerQueriesRepo,
  productRepo,
  uploaderService,
);

export const deleteDeveloperController = new DeleteDeveloperController(deleteDeveloperUseCase);
