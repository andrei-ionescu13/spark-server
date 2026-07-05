import { CollectionModel } from '../../model';
import { CollectionQueriesRepo } from '../../repo/queries';
import { GetCollectionController } from './getCollectionController';
import { GetCollectionUseCase } from './getCollectionUseCase';

const collectionQueriesRepo = new CollectionQueriesRepo(CollectionModel);
const getCollectionUseCase = new GetCollectionUseCase(collectionQueriesRepo);
export const getCollectionController = new GetCollectionController(getCollectionUseCase);
