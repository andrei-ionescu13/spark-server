import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { UpdateCollectionController } from './updateCollectionController';
import { UpdateCollectionUseCase } from './updateCollectionUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);

const uploaderService = new CloudinaryUploaderService();

const updateCollectionUseCase = new UpdateCollectionUseCase(collectionRepo, uploaderService);
export const updateCollectionController = new UpdateCollectionController(updateCollectionUseCase);
