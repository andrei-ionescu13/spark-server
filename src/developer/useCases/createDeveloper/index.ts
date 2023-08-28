import { DeveloperRepo } from '../../developerRepo';
import { DeveloperModel } from '../../model';
import { CreateDeveloperController } from './createDeveloperController';
import { CreateDeveloperUseCase } from './createDeveloperUseCase';

const developerRepo = new DeveloperRepo(DeveloperModel);
const createDeveloperUseCase = new CreateDeveloperUseCase(developerRepo);
export const createDeveloperController = new CreateDeveloperController(createDeveloperUseCase);
