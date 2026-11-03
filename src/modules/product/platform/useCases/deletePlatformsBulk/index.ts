import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PlatformCommandsRepo } from '../../repo/commands';
import { PlatformQueriesRepo } from '../../repo/queries';
import { DeletePlatformsBulkController } from './deletePlatformsBulkController';
import { DeletePlatformsBulkUseCase } from './deletePlatformsBulkUseCase';

const platformCommandsRepo = new PlatformCommandsRepo(Mongo.getCollection('platforms'));
const platformQueriesRepo = new PlatformQueriesRepo(Mongo.getCollection('platforms'));

const uploaderService = new CloudinaryUploaderService();

const deletePlatformsBulkUseCase = new DeletePlatformsBulkUseCase(
  platformCommandsRepo,
  platformQueriesRepo,
  uploaderService,
);
export const deletePlatformsBulkController = new DeletePlatformsBulkController(
  deletePlatformsBulkUseCase,
);
