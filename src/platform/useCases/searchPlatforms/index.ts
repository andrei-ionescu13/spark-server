import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { SearchPlatformsController } from './searchPlatformsController';
import { SearchPlatformsUseCase } from './searchPlatformsUseCase';

const platformRepo = new PlatformRepo(PlatformModel);
const searchPlatformsUseCase = new SearchPlatformsUseCase(platformRepo);
export const searchPlatformsController = new SearchPlatformsController(searchPlatformsUseCase);
