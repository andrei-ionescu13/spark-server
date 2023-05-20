import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { GetPublisherController } from './getPublisherController';
import { GetPublisherUseCase } from './getPublisherUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);
const getPublisherUseCase = new GetPublisherUseCase(publisherRepo);
export const getPublisherController = new GetPublisherController(getPublisherUseCase);
