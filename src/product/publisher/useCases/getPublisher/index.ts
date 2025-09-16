import { PublisherModel } from '../../model';
import { PublisherQueriesRepo } from '../../repo/queries';
import { GetPublisherController } from './getPublisherController';
import { GetPublisherUseCase } from './getPublisherUseCase';

const publisherQueriesRepo = new PublisherQueriesRepo(PublisherModel);
const getPublisherUseCase = new GetPublisherUseCase(publisherQueriesRepo);
export const getPublisherController = new GetPublisherController(getPublisherUseCase);
