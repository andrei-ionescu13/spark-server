import { CollectionRepo } from '../../collectionRepo';
import { CollectionModel } from '../../model';
import { SearchCollectionsController } from './searchCollectionsController';
import { SearchCollectionsUseCase } from './searchCollectionsUseCase';

const collectionRepo = new CollectionRepo(CollectionModel);
const searchCollectionsUseCase = new SearchCollectionsUseCase(collectionRepo);
export const searchCollectionsController = new SearchCollectionsController(
  searchCollectionsUseCase,
);
