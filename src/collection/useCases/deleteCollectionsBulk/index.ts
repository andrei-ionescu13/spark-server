import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionModel } from '../../model';
import { CollectionCommandsRepo } from '../../repo/commands';
import { CollectionQueriesRepo } from '../../repo/queries';
import { DeleteCollectionsBulkController } from './deleteCollectionsBulkController';
import { DeleteCollectionsBulkUseCase } from './deleteCollectionsBulkUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(CollectionModel);
const collectionQueriesRepo = new CollectionQueriesRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const deleteCollectionsBulkUseCase = new DeleteCollectionsBulkUseCase(
  collectionCommandsRepo,
  collectionQueriesRepo,
  uploaderService,
);
export const deleteCollectionsBulkController = new DeleteCollectionsBulkController(
  deleteCollectionsBulkUseCase,
);
