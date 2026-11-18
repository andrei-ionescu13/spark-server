import { Mongo } from '../../../../../mongo';
import { PlatformQueriesRepo } from '../../repo/queries';
import { GetPlatformController } from './getPlatformController';
import { GetPlatformUseCase } from './getPlatformUseCase';

const platformQueriesRepo = new PlatformQueriesRepo();
const getPlatformUseCase = new GetPlatformUseCase(platformQueriesRepo);
export const getPlatformController = new GetPlatformController(getPlatformUseCase);
