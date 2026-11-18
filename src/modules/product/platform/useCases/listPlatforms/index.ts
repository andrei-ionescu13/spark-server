import { Mongo } from '../../../../../mongo';
import { PlatformQueriesRepo } from '../../repo/queries';
import { ListPlatformsController } from './listPlatformsController';
import { ListPlatformsUseCase } from './listPlatformsUseCase';

const platformQueriesRepo = new PlatformQueriesRepo();
const listPlatformsUseCase = new ListPlatformsUseCase(platformQueriesRepo);
export const listPlatformsController = new ListPlatformsController(listPlatformsUseCase);
