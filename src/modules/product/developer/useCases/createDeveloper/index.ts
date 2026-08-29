import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { CreateDeveloperController } from './createDeveloperController';
import { CreateDeveloperUseCase } from './createDeveloperUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(Mongo.getCollection('developers'));
const uploaderService = new CloudinaryUploaderService();
const createDeveloperUseCase = new CreateDeveloperUseCase(developerCommandsRepo, uploaderService);
export const createDeveloperController = new CreateDeveloperController(createDeveloperUseCase);
