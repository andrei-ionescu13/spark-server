import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { ListPlatformsController } from './listPlatformsController';
import { ListPlatformsUseCase } from './listPlatformsUseCase';

const platformRepo = new PlatformRepo(PlatformModel);
const listPlatformsUseCase = new ListPlatformsUseCase(platformRepo);
export const listPlatformsController = new ListPlatformsController(listPlatformsUseCase);
