import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { CreatePlatformController } from './createPlatformController';
import { CreatePlatformUseCase } from './createPlatformUseCase';

const platformRepo = new PlatformRepo(PlatformModel);

const uploaderService = new CloudinaryUploaderService();

const createPlatformUseCase = new CreatePlatformUseCase(platformRepo, uploaderService);
export const createPlatformController = new CreatePlatformController(createPlatformUseCase);
