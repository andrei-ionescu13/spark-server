import { Mongo } from '../../../../../mongo';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { GetDeveloperController } from './getDeveloperController';
import { GetDeveloperUseCase } from './getDeveloperUseCase';

const developerQueriesRepo = new DeveloperQueriesRepo(Mongo.getCollection('developers'));
const getDeveloperUseCase = new GetDeveloperUseCase(developerQueriesRepo);
export const getDeveloperController = new GetDeveloperController(getDeveloperUseCase);
