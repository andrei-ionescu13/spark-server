import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { DeletePublisherController } from './deletePublisherController';
import { DeletePublisherUseCase } from './deletePublisherUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);

const uploaderService = new CloudinaryUploaderService();

const deletePublisherUseCase = new DeletePublisherUseCase(publisherRepo, uploaderService);
export const deletePublisherController = new DeletePublisherController(deletePublisherUseCase);
