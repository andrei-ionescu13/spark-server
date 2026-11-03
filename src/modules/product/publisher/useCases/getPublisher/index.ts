import { Mongo } from '../../../../../mongo';
import { PublisherQueriesRepo } from '../../repo/queries';
import { GetPublisherController } from './getPublisherController';
import { GetPublisherUseCase } from './getPublisherUseCase';

const publisherQueriesRepo = new PublisherQueriesRepo(Mongo.getCollection('publishers'));
const getPublisherUseCase = new GetPublisherUseCase(publisherQueriesRepo);
export const getPublisherController = new GetPublisherController(getPublisherUseCase);
