import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { UpdateDeveloperController } from './updateDeveloperController';
import { UpdateDeveloperUseCase } from './updateDeveloperUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(Mongo.getCollection('developers'));

const uploaderService = new CloudinaryUploaderService();

const updateDeveloperUseCase = new UpdateDeveloperUseCase(developerCommandsRepo, uploaderService);
export const updateDeveloperController = new UpdateDeveloperController(updateDeveloperUseCase);
