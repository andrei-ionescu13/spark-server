import { Mongo } from '../../../../../mongo';
import { PublisherQueriesRepo } from '../../repo/queries';
import { SearchPublishersController } from './searchPublishersController';
import { SearchPublishersUseCase } from './searchPublishersUseCase';

const publisherQueriesRepo = new PublisherQueriesRepo(Mongo.getCollection('publishers'));
const searchPublishersUseCase = new SearchPublishersUseCase(publisherQueriesRepo);
export const searchPublishersController = new SearchPublishersController(searchPublishersUseCase);
