import { Mongo } from '../../../../../mongo';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { SearchDevelopersController } from './searchDevelopersController';
import { SearchDevelopersUseCase } from './searchDevelopersUseCase';

const developerQueriesRepo = new DeveloperQueriesRepo(Mongo.getCollection('developers'));
const searchDevelopersUseCase = new SearchDevelopersUseCase(developerQueriesRepo);
export const searchDevelopersController = new SearchDevelopersController(searchDevelopersUseCase);
