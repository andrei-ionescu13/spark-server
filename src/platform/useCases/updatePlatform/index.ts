import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { UpdatePlatformController } from './updatePlatformController';
import { UpdatePlatformUseCase } from './updatePlatformUseCase';

const platformRepo = new PlatformRepo(PlatformModel);

const uploaderService = new CloudinaryUploaderService();

const updatePlatformUseCase = new UpdatePlatformUseCase(platformRepo, uploaderService);
export const updatePlatformController = new UpdatePlatformController(updatePlatformUseCase);
