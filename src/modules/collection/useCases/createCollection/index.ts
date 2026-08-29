import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { CollectionCommandsRepo } from '../../repo/commands';
import { CreateCollectionController } from './createCollectionController';
import { CreateCollectionUseCase } from './createCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(Mongo.getCollection('collections'));
const uploaderService = new CloudinaryUploaderService();

const createCollectionUseCase = new CreateCollectionUseCase(
  collectionCommandsRepo,
  uploaderService,
);
export const createCollectionController = new CreateCollectionController(createCollectionUseCase);
