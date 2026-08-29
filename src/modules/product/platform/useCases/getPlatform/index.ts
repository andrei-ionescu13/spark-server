import { Mongo } from '../../../../../mongo';
import { PlatformModel } from '../../model';
import { PlatformQueriesRepo } from '../../repo/queries';
import { GetPlatformController } from './getPlatformController';
import { GetPlatformUseCase } from './getPlatformUseCase';

const platformQueriesRepo = new PlatformQueriesRepo(Mongo.getCollection('platforms'));
const getPlatformUseCase = new GetPlatformUseCase(platformQueriesRepo);
export const getPlatformController = new GetPlatformController(getPlatformUseCase);
