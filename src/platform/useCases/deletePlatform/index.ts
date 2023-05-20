import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { DeletePlatformController } from './deletePlatformController';
import { DeletePlatformUseCase } from './deletePlatformUseCase';

const platformRepo = new PlatformRepo(PlatformModel);

const uploaderService = new CloudinaryUploaderService();

const deletePlatformUseCase = new DeletePlatformUseCase(platformRepo, uploaderService);
export const deletePlatformController = new DeletePlatformController(deletePlatformUseCase);
