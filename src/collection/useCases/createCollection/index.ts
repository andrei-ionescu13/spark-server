import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { CreateCollectionController } from './createCollectionController';
import { CreateCollectionUseCase } from './createCollectionUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const createCollectionUseCase = new CreateCollectionUseCase(collectionRepo, uploaderService);
export const createCollectionController = new CreateCollectionController(createCollectionUseCase);
