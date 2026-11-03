import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PlatformCommandsRepo } from '../../repo/commands';
import { CreatePlatformController } from './createPlatformController';
import { CreatePlatformUseCase } from './createPlatformUseCase';

const platformCommandsRepo = new PlatformCommandsRepo(Mongo.getCollection('platforms'));
const uploaderService = new CloudinaryUploaderService();
const createPlatformUseCase = new CreatePlatformUseCase(platformCommandsRepo, uploaderService);
export const createPlatformController = new CreatePlatformController(createPlatformUseCase);
