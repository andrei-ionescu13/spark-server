import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PublisherCommandsRepo } from '../../repo/commands';
import { PublisherQueriesRepo } from '../../repo/queries';
import { DeletePublisherController } from './deletePublisherController';
import { DeletePublisherUseCase } from './deletePublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo();
const publisherQueriesRepo = new PublisherQueriesRepo();

const uploaderService = new CloudinaryUploaderService();

const deletePublisherUseCase = new DeletePublisherUseCase(
  publisherCommandsRepo,
  publisherQueriesRepo,
  uploaderService,
);

export const deletePublisherController = new DeletePublisherController(deletePublisherUseCase);
