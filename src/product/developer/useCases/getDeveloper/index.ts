import { DeveloperModel } from '../../model';
import { DeveloperQueriesRepo } from '../../repo/queries';
import { GetDeveloperController } from './getDeveloperController';
import { GetDeveloperUseCase } from './getDeveloperUseCase';

const developerQueriesRepo = new DeveloperQueriesRepo(DeveloperModel);
const getDeveloperUseCase = new GetDeveloperUseCase(developerQueriesRepo);
export const getDeveloperController = new GetDeveloperController(getDeveloperUseCase);
