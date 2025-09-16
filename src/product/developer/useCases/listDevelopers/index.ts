import { DeveloperModel } from '../../model';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { ListDevelopersController } from './listDevelopersController';
import { ListDevelopersUseCase } from './listDevelopersUseCase';

const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const listDevelopersUseCase = new ListDevelopersUseCase(developerQueriesRepo);
export const listDevelopersController = new ListDevelopersController(listDevelopersUseCase);
