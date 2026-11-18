import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PlatformCommandsRepo } from '../../repo/commands';
import { UpdatePlatformController } from './updatePlatformController';
import { UpdatePlatformUseCase } from './updatePlatformUseCase';

const platformCommandsRepo = new PlatformCommandsRepo();

const uploaderService = new CloudinaryUploaderService();

const updatePlatformUseCase = new UpdatePlatformUseCase(platformCommandsRepo, uploaderService);
export const updatePlatformController = new UpdatePlatformController(updatePlatformUseCase);
