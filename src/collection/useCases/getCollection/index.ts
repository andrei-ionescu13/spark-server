import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { GetCollectionController } from './getCollectionController';
import { GetCollectionUseCase } from './getCollectionUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);
const getCollectionUseCase = new GetCollectionUseCase(collectionRepo);
export const getCollectionController = new GetCollectionController(getCollectionUseCase);
