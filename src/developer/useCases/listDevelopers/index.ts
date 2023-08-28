import { DeveloperRepo } from '../../developerRepo';
import { DeveloperModel } from '../../model';
import { ListDevelopersController } from './listDevelopersController';
import { ListDevelopersUseCase } from './listDevelopersUseCase';

const developerRepo = new DeveloperRepo(DeveloperModel);
const listDevelopersUseCase = new ListDevelopersUseCase(developerRepo);
export const listDevelopersController = new ListDevelopersController(listDevelopersUseCase);
