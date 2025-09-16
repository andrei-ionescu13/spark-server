import { CollectionModel } from '../../model';
import { CollectionCommandsRepo } from '../../repo/commands';
import { DeactivateCollectionController } from './deactivateCollectionController';
import { DeactivateCollectionUseCase } from './deactivateCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(CollectionModel);
const deactivateCollectionUseCase = new DeactivateCollectionUseCase(collectionCommandsRepo);
export const deactivateCollectionController = new DeactivateCollectionController(
  deactivateCollectionUseCase,
);
