import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { DeletePublishersBulkController } from './deletePublishersBulkController';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);
const deletePublishersBulkUseCase = new DeletePublishersBulkUseCase(publisherRepo);
export const deletePublishersBulkController = new DeletePublishersBulkController(
  deletePublishersBulkUseCase,
);
