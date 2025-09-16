import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionModel } from '../../model';
import { CollectionCommandsRepo } from '../../repo/commands';
import { CreateCollectionController } from './createCollectionController';
import { CreateCollectionUseCase } from './createCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const createCollectionUseCase = new CreateCollectionUseCase(
  collectionCommandsRepo,
  uploaderService,
);
export const createCollectionController = new CreateCollectionController(createCollectionUseCase);
