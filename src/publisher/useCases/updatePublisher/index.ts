import { CloudinaryUploaderService } from '../../../services/uploaderService';
import { PublisherModel } from '../../model';
import { PublisherRepo } from '../../publisherRepo';
import { UpdatePublisherController } from './updatePublisherController';
import { UpdatePublisherUseCase } from './updatePublisherUseCase';

const publisherRepo = new PublisherRepo(PublisherModel);

const uploaderService = new CloudinaryUploaderService();

const updatePublisherUseCase = new UpdatePublisherUseCase(publisherRepo, uploaderService);
export const updatePublisherController = new UpdatePublisherController(updatePublisherUseCase);
