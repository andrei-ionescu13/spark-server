import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { CollectionCommandsRepo } from '../../repo/commands';
import { UpdateCollectionController } from './updateCollectionController';
import { UpdateCollectionUseCase } from './updateCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(Mongo.getCollection('collections'));
const uploaderService = new CloudinaryUploaderService();

const updateCollectionUseCase = new UpdateCollectionUseCase(
  collectionCommandsRepo,
  uploaderService,
);
export const updateCollectionController = new UpdateCollectionController(updateCollectionUseCase);
