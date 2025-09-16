import { PublisherModel } from '../../model';
import { PublisherQueriesRepo } from '../../repo/queries';
import { SearchPublishersController } from './searchPublishersController';
import { SearchPublishersUseCase } from './searchPublishersUseCase';

const publisherQueriesRepo = new PublisherQueriesRepo(PublisherModel);
const searchPublishersUseCase = new SearchPublishersUseCase(publisherQueriesRepo);
export const searchPublishersController = new SearchPublishersController(searchPublishersUseCase);
