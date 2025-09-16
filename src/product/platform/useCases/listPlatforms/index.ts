import { PlatformModel } from '../../model';
import { PlatformQueriesRepo } from '../../repo/queries';
import { ListPlatformsController } from './listPlatformsController';
import { ListPlatformsUseCase } from './listPlatformsUseCase';

const platformQueriesRepo = new PlatformQueriesRepo(PlatformModel);
const listPlatformsUseCase = new ListPlatformsUseCase(platformQueriesRepo);
export const listPlatformsController = new ListPlatformsController(listPlatformsUseCase);
