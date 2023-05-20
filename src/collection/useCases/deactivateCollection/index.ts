import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { DeactivateCollectionController } from './deactivateCollectionController';
import { DeactivateCollectionUseCase } from './deactivateCollectionUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);
const deactivateCollectionUseCase = new DeactivateCollectionUseCase(collectionRepo);
export const deactivateCollectionController = new DeactivateCollectionController(
  deactivateCollectionUseCase,
);
