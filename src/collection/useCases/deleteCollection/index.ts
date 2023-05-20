import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { DeleteCollectionController } from './deleteCollectionController';
import { DeleteCollectionUseCase } from './deleteCollectionUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const deleteCollectionUseCase = new DeleteCollectionUseCase(collectionRepo, uploaderService);
export const deleteCollectionController = new DeleteCollectionController(deleteCollectionUseCase);
