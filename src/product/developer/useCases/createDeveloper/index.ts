import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DeveloperModel } from '../../model';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { CreateDeveloperController } from './createDeveloperController';
import { CreateDeveloperUseCase } from './createDeveloperUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(DeveloperModel);
const uploaderService = new CloudinaryUploaderService();
const createDeveloperUseCase = new CreateDeveloperUseCase(developerCommandsRepo, uploaderService);
export const createDeveloperController = new CreateDeveloperController(createDeveloperUseCase);
