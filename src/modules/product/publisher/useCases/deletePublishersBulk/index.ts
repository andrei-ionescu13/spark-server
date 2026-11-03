import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PublisherCommandsRepo } from '../../repo/commands';
import { PublisherQueriesRepo } from '../../repo/queries';
import { DeletePublishersBulkController } from './deletePublishersBulkController';
import { DeletePublishersBulkUseCase } from './deletePublishersBulkUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(Mongo.getCollection('publishers'));
const publisherQueriesRepo = new PublisherQueriesRepo(Mongo.getCollection('publishers'));

const uploaderService = new CloudinaryUploaderService();

const deletePublishersBulkUseCase = new DeletePublishersBulkUseCase(
  publisherCommandsRepo,
  publisherQueriesRepo,
  uploaderService,
);
export const deletePublishersBulkController = new DeletePublishersBulkController(
  deletePublishersBulkUseCase,
);
