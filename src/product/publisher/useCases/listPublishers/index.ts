import { PublisherModel } from '../../model';
import { PublisherQueriesRepo } from '../../repo/queries';
import { ListPublishersController } from './listPublishersController';
import { ListPublishersUseCase } from './listPublishersUseCase';

const publisherQueriesRepo = new PublisherQueriesRepo(PublisherModel);
const listPublishersUseCase = new ListPublishersUseCase(publisherQueriesRepo);
export const listPublishersController = new ListPublishersController(listPublishersUseCase);
