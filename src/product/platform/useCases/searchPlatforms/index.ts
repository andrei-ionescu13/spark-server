import { PlatformModel } from '../../model';
import { PlatformQueriesRepo } from '../../repo/queries';
import { SearchPlatformsController } from './searchPlatformsController';
import { SearchPlatformsUseCase } from './searchPlatformsUseCase';

const platformQueriesRepo = new PlatformQueriesRepo(PlatformModel);
const searchPlatformsUseCase = new SearchPlatformsUseCase(platformQueriesRepo);
export const searchPlatformsController = new SearchPlatformsController(searchPlatformsUseCase);
