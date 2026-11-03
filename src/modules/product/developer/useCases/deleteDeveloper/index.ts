import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { ProductQueriesRepo } from '../../../repo/queries';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { DeleteDeveloperController } from './deleteDeveloperController';
import { DeleteDeveloperUseCase } from './deleteDeveloperUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(Mongo.getCollection('developers'));
const developerQueriesRepo = new DeveloperQueriesRepo(Mongo.getCollection('developers'));
const productQueriesRepo = new ProductQueriesRepo(Mongo.getCollection('products'));

const uploaderService = new CloudinaryUploaderService();

const deleteDeveloperUseCase = new DeleteDeveloperUseCase(
  developerCommandsRepo,
  developerQueriesRepo,
  productQueriesRepo,
  uploaderService,
);

export const deleteDeveloperController = new DeleteDeveloperController(deleteDeveloperUseCase);
