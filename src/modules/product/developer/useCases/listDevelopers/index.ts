import { Mongo } from '../../../../../mongo';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { ListDevelopersController } from './listDevelopersController';
import { ListDevelopersUseCase } from './listDevelopersUseCase';

const developerQueriesRepo = new DeveloperQueriesRepo(Mongo.getCollection('developers'));
const listDevelopersUseCase = new ListDevelopersUseCase(developerQueriesRepo);
export const listDevelopersController = new ListDevelopersController(listDevelopersUseCase);
