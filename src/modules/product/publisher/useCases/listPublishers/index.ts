import { Mongo } from '../../../../../mongo';
import { PublisherQueriesRepo } from '../../repo/queries';
import { ListPublishersController } from './listPublishersController';
import { ListPublishersUseCase } from './listPublishersUseCase';

const publisherQueriesRepo = new PublisherQueriesRepo(Mongo.getCollection('publishers'));
const listPublishersUseCase = new ListPublishersUseCase(publisherQueriesRepo);
export const listPublishersController = new ListPublishersController(listPublishersUseCase);
