import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { ListPublishersController } from './listPublishersController';
import { ListPublishersUseCase } from './listPublishersUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);
const listPublishersUseCase = new ListPublishersUseCase(publisherRepo);
export const listPublishersController = new ListPublishersController(listPublishersUseCase);
