import { Mongo } from '../../../../mongo';
import { CollectionQueriesRepo } from '../../repo/queries';
import { SearchCollectionsController } from './searchCollectionsController';
import { SearchCollectionsUseCase } from './searchCollectionsUseCase';

const collectionQueriesRepo = new CollectionQueriesRepo(Mongo.getCollection('collections'));
const searchCollectionsUseCase = new SearchCollectionsUseCase(collectionQueriesRepo);
export const searchCollectionsController = new SearchCollectionsController(
  searchCollectionsUseCase,
);
