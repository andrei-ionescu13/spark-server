import { Mongo } from '../../../../mongo';
import { CollectionCommandsRepo } from '../../repo/commands';
import { DeactivateCollectionController } from './deactivateCollectionController';
import { DeactivateCollectionUseCase } from './deactivateCollectionUseCase';

const collectionCommandsRepo = new CollectionCommandsRepo(Mongo.getCollection('collections'));
const deactivateCollectionUseCase = new DeactivateCollectionUseCase(collectionCommandsRepo);
export const deactivateCollectionController = new DeactivateCollectionController(
  deactivateCollectionUseCase,
);
