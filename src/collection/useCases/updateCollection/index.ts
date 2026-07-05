import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionModel } from '../../model';
import { CollectionCommandsRepo } from '../../repo/commands';
import { UpdateCollectionController } from './updateCollectionController';
import { UpdateCollectionUseCase } from './updateCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const updateCollectionUseCase = new UpdateCollectionUseCase(
  collectionCommandsRepo,
  uploaderService,
);
export const updateCollectionController = new UpdateCollectionController(updateCollectionUseCase);
