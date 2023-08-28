import { DeveloperRepo } from '../../developerRepo';
import { DeveloperModel } from '../../model';
import { UpdateDeveloperController } from './updateDeveloperController';
import { UpdateDeveloperUseCase } from './updateDeveloperUseCase';

const developerRepo = new DeveloperRepo(DeveloperModel);
const updateDeveloperUseCase = new UpdateDeveloperUseCase(developerRepo);
export const updateDeveloperController = new UpdateDeveloperController(updateDeveloperUseCase);
