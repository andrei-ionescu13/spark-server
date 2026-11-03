import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PlatformCommandsRepo } from '../../repo/commands';
import { PlatformQueriesRepo } from '../../repo/queries';
import { DeletePlatformController } from './deletePlatformController';
import { DeletePlatformUseCase } from './deletePlatformUseCase';

const platformCommandsRepo = new PlatformCommandsRepo(Mongo.getCollection('platforms'));
const platformQueriesRepo = new PlatformQueriesRepo(Mongo.getCollection('platforms'));

const uploaderService = new CloudinaryUploaderService();

const deletePlatformUseCase = new DeletePlatformUseCase(
  platformCommandsRepo,
  platformQueriesRepo,
  uploaderService,
);

export const deletePlatformController = new DeletePlatformController(deletePlatformUseCase);
