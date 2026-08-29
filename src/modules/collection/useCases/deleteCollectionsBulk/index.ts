import { Mongo } from '../../../../mongo';
import { CloudinaryUploaderService } from '../../../../services/uploaderService';
import { CollectionCommandsRepo } from '../../repo/commands';
import { CollectionQueriesRepo } from '../../repo/queries';
import { DeleteCollectionsBulkController } from './deleteCollectionsBulkController';
import { DeleteCollectionsBulkUseCase } from './deleteCollectionsBulkUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(Mongo.getCollection('collections'));
const collectionQueriesRepo = new CollectionQueriesRepo(Mongo.getCollection('collections'));

const uploaderService = new CloudinaryUploaderService();

const deleteCollectionsBulkUseCase = new DeleteCollectionsBulkUseCase(
  collectionCommandsRepo,
  collectionQueriesRepo,
  uploaderService,
);
export const deleteCollectionsBulkController = new DeleteCollectionsBulkController(
  deleteCollectionsBulkUseCase,
);
