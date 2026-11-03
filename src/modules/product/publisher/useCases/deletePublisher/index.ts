import { Mongo } from '../../../../../mongo';
import { CloudinaryUploaderService } from '../../../../../services/uploaderService';
import { PublisherCommandsRepo } from '../../repo/commands';
import { PublisherQueriesRepo } from '../../repo/queries';
import { DeletePublisherController } from './deletePublisherController';
import { DeletePublisherUseCase } from './deletePublisherUseCase';

const publisherCommandsRepo = new PublisherCommandsRepo(Mongo.getCollection('publishers'));
const publisherQueriesRepo = new PublisherQueriesRepo(Mongo.getCollection('publishers'));

const uploaderService = new CloudinaryUploaderService();

const deletePublisherUseCase = new DeletePublisherUseCase(
  publisherCommandsRepo,
  publisherQueriesRepo,
  uploaderService,
);

export const deletePublisherController = new DeletePublisherController(deletePublisherUseCase);
