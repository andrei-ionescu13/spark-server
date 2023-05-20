import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { GetPlatformController } from './getPlatformController';
import { GetPlatformUseCase } from './getPlatformUseCase';

const platformRepo = new PlatformRepo(PlatformModel);
const getPlatformUseCase = new GetPlatformUseCase(platformRepo);
export const getPlatformController = new GetPlatformController(getPlatformUseCase);
