import { Mongo } from '../../../../../mongo';
import { PlatformQueriesRepo } from '../../repo/queries';
import { SearchPlatformsController } from './searchPlatformsController';
import { SearchPlatformsUseCase } from './searchPlatformsUseCase';

const platformQueriesRepo = new PlatformQueriesRepo();
const searchPlatformsUseCase = new SearchPlatformsUseCase(platformQueriesRepo);
export const searchPlatformsController = new SearchPlatformsController(searchPlatformsUseCase);
