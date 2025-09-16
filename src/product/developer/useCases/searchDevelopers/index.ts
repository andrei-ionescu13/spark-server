import { DeveloperModel } from '../../model';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { SearchDevelopersController } from './searchDevelopersController';
import { SearchDevelopersUseCase } from './searchDevelopersUseCase';

const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const searchDevelopersUseCase = new SearchDevelopersUseCase(developerQueriesRepo);
export const searchDevelopersController = new SearchDevelopersController(searchDevelopersUseCase);
