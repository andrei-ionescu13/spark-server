import { Mongo } from '../../../../mongo';
import { CollectionQueriesRepo } from '../../repo/queries';
import { GetCollectionController } from './getCollectionController';
import { GetCollectionUseCase } from './getCollectionUseCase';

const collectionQueriesRepo = new CollectionQueriesRepo(Mongo.getCollection('collections'));
const getCollectionUseCase = new GetCollectionUseCase(collectionQueriesRepo);
export const getCollectionController = new GetCollectionController(getCollectionUseCase);
