import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { DeleteCollectionsBulkController } from './deleteCollectionsBulkController';
import { DeleteCollectionsBulkUseCase } from './deleteCollectionsBulkUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const deleteCollectionsBulkUseCase = new DeleteCollectionsBulkUseCase(
  collectionRepo,
  uploaderService,
);
export const deleteCollectionsBulkController = new DeleteCollectionsBulkController(
  deleteCollectionsBulkUseCase,
);
