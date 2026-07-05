import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionModel } from '../../model';
import { CollectionCommandsRepo } from '../../repo/commands';
import { CollectionQueriesRepo } from '../../repo/queries';
import { DeleteCollectionController } from './deleteCollectionController';
import { DeleteCollectionUseCase } from './deleteCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(CollectionModel);
const collectionQueriesRepo = new CollectionQueriesRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const deleteCollectionUseCase = new DeleteCollectionUseCase(
  collectionCommandsRepo,
  collectionQueriesRepo,
  uploaderService,
);
export const deleteCollectionController = new DeleteCollectionController(deleteCollectionUseCase);
