import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { CollectionCommandsRepo } from '../../repo/commands';
import { CollectionQueriesRepo } from '../../repo/queries';
import { DeleteCollectionController } from './deleteCollectionController';
import { DeleteCollectionUseCase } from './deleteCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(Mongo.getCollection('collections'));
const collectionQueriesRepo = new CollectionQueriesRepo(Mongo.getCollection('collections'));

const uploaderService = new CloudinaryUploaderService();

const deleteCollectionUseCase = new DeleteCollectionUseCase(
  collectionCommandsRepo,
  collectionQueriesRepo,
  uploaderService,
);
export const deleteCollectionController = new DeleteCollectionController(deleteCollectionUseCase);
