import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PlatformModel } from '../../model';
import { PlatformRepo } from '../../platformRepo';
import { DeletePlatformsBulkController } from './deletePlatformsBulkController';
import { DeletePlatformsBulkUseCase } from './deletePlatformsBulkUseCase';

const platformRepo = new PlatformRepo(PlatformModel);

const uploaderService = new CloudinaryUploaderService();

const deletePlatformsBulkUseCase = new DeletePlatformsBulkUseCase(platformRepo, uploaderService);
export const deletePlatformsBulkController = new DeletePlatformsBulkController(
  deletePlatformsBulkUseCase,
);
