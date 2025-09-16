import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { DeveloperModel } from '../../model';
import { DeveloperCommandsRepo } from '../../repo/commands';
import { UpdateDeveloperController } from './updateDeveloperController';
import { UpdateDeveloperUseCase } from './updateDeveloperUseCase';

const developerCommandsRepo = new DeveloperCommandsRepo(DeveloperModel);

const uploaderService = new CloudinaryUploaderService();

const updateDeveloperUseCase = new UpdateDeveloperUseCase(developerCommandsRepo, uploaderService);
export const updateDeveloperController = new UpdateDeveloperController(updateDeveloperUseCase);
