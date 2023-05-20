import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { SearchPublishersController } from './searchPublishersController';
import { SearchPublishersUseCase } from './searchPublishersUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);
const searchPublishersUseCase = new SearchPublishersUseCase(publisherRepo);
export const searchPublishersController = new SearchPublishersController(searchPublishersUseCase);
