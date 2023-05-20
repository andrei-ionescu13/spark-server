import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { CreatePublisherController } from './createPublisherController';
import { CreatePublisherUseCase } from './createPublisherUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);

const uploaderService = new CloudinaryUploaderService();

const createPublisherUseCase = new CreatePublisherUseCase(publisherRepo, uploaderService);
export const createPublisherController = new CreatePublisherController(createPublisherUseCase);
